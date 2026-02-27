"use client"

import { useState, useEffect } from "react"
import { Search, Trash2, Loader2, Download, Eye, X, ChevronDown, ChevronUp } from "lucide-react"

interface SurveyResponse {
  id: string
  answers: Record<string, string | string[]>
  contact: {
    name: string
    phone: string
    email: string
    centerName: string
  }
  submittedAt: string
  source: string
}

const questionLabels: Record<string, string> = {
  role: "Vai trò",
  center_type: "Loại hình TT",
  student_count: "Quy mô học viên",
  programs: "Chương trình đào tạo",
  management_tool: "Công cụ quản lý",
  report_tool: "Công cụ báo cáo",
  report_time: "Thời gian làm báo cáo",
  pain_ranking: "Xếp hạng khó khăn",
  biggest_pain: "Vấn đề cần giải quyết nhất",
  digital_status: "Mức độ CĐS",
  digital_barriers: "Rào cản CĐS",
  budget: "Ngân sách CNTT",
  willingness: "Sẵn sàng thử nghiệm",
  contact_name: "Họ tên",
  contact_phone: "SĐT",
  contact_email: "Email",
  center_name: "Tên trung tâm",
  open_feedback: "Ý kiến thêm",
}

export default function AdminSurveysPage() {
  const [surveys, setSurveys] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<SurveyResponse | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [viewTarget, setViewTarget] = useState<SurveyResponse | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchSurveys()
  }, [])

  async function fetchSurveys() {
    try {
      const response = await fetch("/api/surveys")
      const data = await response.json()
      if (data.surveys) {
        setSurveys(data.surveys)
      }
    } catch (error) {
      console.error("Error fetching surveys:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/surveys?id=${deleteTarget.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSurveys(surveys.filter((s) => s.id !== deleteTarget.id))
        setDeleteTarget(null)
      } else {
        alert("Failed to delete survey")
      }
    } catch (error) {
      console.error("Error deleting survey:", error)
      alert("Failed to delete survey")
    } finally {
      setDeleting(false)
    }
  }

  function exportCSV() {
    if (surveys.length === 0) return

    const headers = [
      "Ngày gửi",
      "Họ tên",
      "SĐT",
      "Email",
      "Tên trung tâm",
      "Vai trò",
      "Loại hình TT",
      "Quy mô học viên",
      "Chương trình đào tạo",
      "Công cụ quản lý",
      "Công cụ báo cáo",
      "Thời gian làm báo cáo",
      "Xếp hạng khó khăn",
      "Vấn đề cần giải quyết nhất",
      "Mức độ CĐS",
      "Rào cản CĐS",
      "Ngân sách CNTT",
      "Sẵn sàng thử nghiệm",
      "Ý kiến thêm",
    ]

    const rows = surveys.map((s) => {
      const formatValue = (val: string | string[] | undefined) => {
        if (!val) return ""
        if (Array.isArray(val)) return val.join("; ")
        return val
      }

      return [
        s.submittedAt ? new Date(s.submittedAt).toLocaleString("vi-VN") : "",
        s.contact?.name || "",
        s.contact?.phone || "",
        s.contact?.email || "",
        s.contact?.centerName || "",
        formatValue(s.answers?.role),
        formatValue(s.answers?.center_type),
        formatValue(s.answers?.student_count),
        formatValue(s.answers?.programs),
        formatValue(s.answers?.management_tool),
        formatValue(s.answers?.report_tool),
        formatValue(s.answers?.report_time),
        formatValue(s.answers?.pain_ranking),
        formatValue(s.answers?.biggest_pain),
        formatValue(s.answers?.digital_status),
        formatValue(s.answers?.digital_barriers),
        formatValue(s.answers?.budget),
        formatValue(s.answers?.willingness),
        formatValue(s.answers?.open_feedback),
      ]
    })

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `khao-sat-ttn-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  function toggleRow(id: string) {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const filtered = surveys.filter((s) => {
    const searchLower = search.toLowerCase()
    return (
      s.contact?.name?.toLowerCase().includes(searchLower) ||
      s.contact?.centerName?.toLowerCase().includes(searchLower) ||
      s.contact?.phone?.includes(search)
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 pt-16 md:pt-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 pt-16 md:p-8 md:pt-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg text-foreground">Khảo sát TTN</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {surveys.length} phản hồi
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={surveys.length === 0}
          className="flex items-center gap-2 border border-primary px-4 py-2 text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm theo tên, trung tâm, SĐT..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-border bg-card py-2.5 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="border border-border">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_120px_100px_80px] gap-4 border-b border-border bg-secondary/50 px-5 py-3 text-xs text-muted-foreground">
          <span>Họ tên</span>
          <span>Trung tâm</span>
          <span>SĐT</span>
          <span>Ngày gửi</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs text-muted-foreground">
            Chưa có phản hồi nào.
          </div>
        ) : (
          filtered.map((survey) => (
            <div key={survey.id}>
              <div className="grid grid-cols-[1fr_1fr_120px_100px_80px] items-center gap-4 border-b border-border px-5 py-3">
                <span className="truncate text-xs text-foreground">
                  {survey.contact?.name || "—"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {survey.contact?.centerName || "—"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {survey.contact?.phone || "—"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {survey.submittedAt
                    ? new Date(survey.submittedAt).toLocaleDateString("vi-VN")
                    : "—"}
                </span>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => toggleRow(survey.id)}
                    className="p-1 text-muted-foreground transition-colors hover:text-primary"
                    aria-label="Toggle details"
                  >
                    {expandedRows.has(survey.id) ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewTarget(survey)}
                    className="p-1 text-muted-foreground transition-colors hover:text-primary"
                    aria-label="View details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(survey)}
                    className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded row */}
              {expandedRows.has(survey.id) && (
                <div className="border-b border-border bg-secondary/30 px-5 py-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    {Object.entries(survey.answers || {}).slice(0, 6).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-muted-foreground">{questionLabels[key] || key}:</span>
                        <span className="ml-2 text-foreground">
                          {Array.isArray(value) ? value.join(", ") : value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* View modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-border bg-background">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background px-6 py-4">
              <div>
                <h2 className="text-sm text-foreground">{viewTarget.contact?.name || "Chi tiết"}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {viewTarget.contact?.centerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Contact info */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1">SĐT</p>
                  <p className="text-xs text-foreground">{viewTarget.contact?.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1">Email</p>
                  <p className="text-xs text-foreground">{viewTarget.contact?.email || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1">Ngày gửi</p>
                  <p className="text-xs text-foreground">
                    {viewTarget.submittedAt
                      ? new Date(viewTarget.submittedAt).toLocaleString("vi-VN")
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Answers */}
              <div className="space-y-3">
                {Object.entries(viewTarget.answers || {}).map(([key, value]) => {
                  if (key.startsWith("contact_") || key === "center_name") return null
                  return (
                    <div key={key}>
                      <p className="text-[10px] uppercase text-muted-foreground mb-1">
                        {questionLabels[key] || key}
                      </p>
                      <p className="text-xs text-foreground">
                        {Array.isArray(value)
                          ? key === "pain_ranking"
                            ? value.map((item, i) => `${i + 1}. ${item}`).join(" → ")
                            : value.join(", ")
                          : value || "—"}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-border bg-background p-6">
            <h2 className="mb-2 text-sm text-foreground">Xác nhận xóa</h2>
            <p className="mb-6 text-xs text-muted-foreground">
              Bạn có chắc muốn xóa phản hồi của &ldquo;{deleteTarget.contact?.name}&rdquo;?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 border border-destructive px-4 py-2 text-xs text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
              >
                {deleting && <Loader2 className="h-3 w-3 animate-spin" />}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
