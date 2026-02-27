'use client'

import { useState, useEffect, useCallback } from "react"
import { getFirestoreDb } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"

const STORAGE_KEY = "ttn-survey-v1"

interface Question {
  id: string
  section: string
  type: 'radio' | 'checkbox' | 'ranking' | 'text' | 'textarea'
  question: string
  required: boolean
  options?: string[]
  placeholder?: string
}

const questions: Question[] = [
  {
    id: "role",
    section: "Thông tin cơ bản",
    type: "radio",
    question: "Vai trò của anh/chị tại trung tâm?",
    required: true,
    options: [
      "Giám đốc / Phó Giám đốc",
      "Trưởng phòng / Phó phòng",
      "Giáo viên",
      "Nhân viên hành chính",
      "Khác"
    ]
  },
  {
    id: "center_type",
    section: "Thông tin cơ bản",
    type: "radio",
    question: "Loại hình trung tâm?",
    required: true,
    options: [
      "Trung tâm GDTX",
      "Trung tâm GDNN-GDTX",
      "Trung tâm GDNN",
      "Khác"
    ]
  },
  {
    id: "student_count",
    section: "Thông tin cơ bản",
    type: "radio",
    question: "Quy mô học viên hiện tại?",
    required: true,
    options: [
      "Dưới 500",
      "500 - 1,000",
      "1,000 - 2,000",
      "2,000 - 5,000",
      "Trên 5,000"
    ]
  },
  {
    id: "programs",
    section: "Hoạt động đào tạo",
    type: "checkbox",
    question: "Trung tâm đang triển khai những chương trình nào? (chọn nhiều)",
    required: true,
    options: [
      "THPT hệ bổ túc / GDTX",
      "Đào tạo nghề ngắn hạn (tin học, ngoại ngữ...)",
      "Liên kết đào tạo ĐH/CĐ",
      "Bồi dưỡng cán bộ, công chức",
      "Đào tạo tiếng dân tộc",
      "Hướng nghiệp cho học sinh",
      "Giáo dục kỹ năng sống",
      "Khác"
    ]
  },
  {
    id: "management_tool",
    section: "Công cụ quản lý hiện tại",
    type: "radio",
    question: "Hiện tại, trung tâm quản lý học viên chủ yếu bằng gì?",
    required: true,
    options: [
      "Sổ sách, giấy tờ",
      "Excel / Google Sheets",
      "Phần mềm chuyên dụng (VnEdu, SMAS...)",
      "Kết hợp nhiều cách",
      "Chưa có hệ thống rõ ràng"
    ]
  },
  {
    id: "report_tool",
    section: "Công cụ quản lý hiện tại",
    type: "radio",
    question: "Công cụ làm báo cáo cho Sở GD&ĐT?",
    required: true,
    options: [
      "Viết tay / đánh máy Word",
      "Excel tổng hợp",
      "Phần mềm báo cáo",
      "Theo mẫu Sở gửi, điền thủ công",
      "Khác"
    ]
  },
  {
    id: "report_time",
    section: "Công cụ quản lý hiện tại",
    type: "radio",
    question: "Trung bình mất bao lâu để hoàn thành 1 bộ báo cáo cho Sở?",
    required: true,
    options: [
      "Dưới 1 ngày",
      "1-3 ngày",
      "3-7 ngày",
      "Trên 1 tuần",
      "Không chắc chắn"
    ]
  },
  {
    id: "pain_ranking",
    section: "Khó khăn & Nhu cầu",
    type: "ranking",
    question: "Xếp hạng các khó khăn theo mức độ ảnh hưởng (1 = ảnh hưởng nhiều nhất):",
    required: true,
    options: [
      "Quản lý thông tin học viên",
      "Làm báo cáo cho Sở/Bộ",
      "Theo dõi điểm danh, kết quả học tập",
      "Thu học phí, quản lý tài chính",
      "Tuyển sinh hàng năm",
      "Quản lý thời khóa biểu, giáo viên",
      "Chuyển đổi số theo yêu cầu Bộ GD"
    ]
  },
  {
    id: "biggest_pain",
    section: "Khó khăn & Nhu cầu",
    type: "radio",
    question: "Nếu chỉ được giải quyết MỘT vấn đề, anh/chị chọn gì?",
    required: true,
    options: [
      "Quản lý học viên tập trung 1 chỗ",
      "Tự động hóa báo cáo cho Sở",
      "Theo dõi tiến độ học tập học sinh",
      "Website tuyển sinh chuyên nghiệp",
      "Hệ thống dạy học trực tuyến (LMS)",
      "Thu học phí online",
      "Khác"
    ]
  },
  {
    id: "digital_status",
    section: "Chuyển đổi số",
    type: "radio",
    question: "Mức độ chuyển đổi số hiện tại của trung tâm?",
    required: true,
    options: [
      "Chưa bắt đầu",
      "Mới bắt đầu (có email, nhóm Zalo)",
      "Đang triển khai (có một số phần mềm)",
      "Khá tốt (hầu hết đã số hóa)",
      "Tốt (đầy đủ hệ thống)"
    ]
  },
  {
    id: "digital_barriers",
    section: "Chuyển đổi số",
    type: "checkbox",
    question: "Rào cản lớn nhất khi chuyển đổi số? (chọn nhiều)",
    required: true,
    options: [
      "Thiếu kinh phí",
      "Thiếu nhân lực CNTT",
      "Giáo viên chưa quen dùng công nghệ",
      "Không biết chọn phần mềm nào",
      "Phần mềm có sẵn không phù hợp",
      "Lãnh đạo chưa quan tâm đúng mức",
      "Đường truyền internet yếu",
      "Khác"
    ]
  },
  {
    id: "budget",
    section: "Ngân sách & Sẵn sàng",
    type: "radio",
    question: "Ngân sách trung tâm có thể dành cho phần mềm/CNTT mỗi năm?",
    required: true,
    options: [
      "Chưa có ngân sách riêng",
      "Dưới 10 triệu VNĐ/năm",
      "10 - 30 triệu VNĐ/năm",
      "30 - 50 triệu VNĐ/năm",
      "Trên 50 triệu VNĐ/năm",
      "Không biết / Cần xin cấp trên"
    ]
  },
  {
    id: "willingness",
    section: "Ngân sách & Sẵn sàng",
    type: "radio",
    question: "Nếu có phần mềm giải quyết đúng vấn đề, trung tâm sẵn sàng thử nghiệm không?",
    required: true,
    options: [
      "Sẵn sàng dùng thử miễn phí ngay",
      "Cần xem demo trước",
      "Cần trao đổi thêm với ban lãnh đạo",
      "Khó khăn, chưa phù hợp lúc này"
    ]
  },
  // Contact fields
  {
    id: "contact_name",
    section: "Thông tin liên hệ",
    type: "text",
    question: "Họ tên anh/chị?",
    required: true,
    placeholder: "Vd: Nguyễn Văn A"
  },
  {
    id: "contact_phone",
    section: "Thông tin liên hệ",
    type: "text",
    question: "Số điện thoại liên hệ?",
    required: true,
    placeholder: "Vd: 0912345678"
  },
  {
    id: "contact_email",
    section: "Thông tin liên hệ",
    type: "text",
    question: "Email (nếu có)?",
    required: false,
    placeholder: "Vd: nguyenvana@gdtx.edu.vn"
  },
  {
    id: "center_name",
    section: "Thông tin liên hệ",
    type: "text",
    question: "Tên trung tâm?",
    required: true,
    placeholder: "Vd: Trung tâm GDTX Lạng Sơn"
  },
  {
    id: "open_feedback",
    section: "Ý kiến thêm",
    type: "textarea",
    question: "Anh/chị có chia sẻ thêm về khó khăn hoặc mong muốn gì không? (tùy chọn)",
    required: false
  }
]

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div style={{ margin: "0 0 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: "#94a3b8" }}>
        <span>{current}/{total} câu hỏi</span>
        <span>{pct}%</span>
      </div>
      <div style={{ height: 6, background: "#1e293b", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: "linear-gradient(90deg, #0ea5e9, #06b6d4)",
          borderRadius: 99,
          transition: "width 0.5s cubic-bezier(.4,0,.2,1)"
        }} />
      </div>
    </div>
  )
}

function RadioQuestion({ q, value, onChange }: { q: Question; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {q.options?.map((opt, i) => (
        <label key={i} onClick={() => onChange(opt)} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
          background: value === opt ? "rgba(14,165,233,0.12)" : "rgba(30,41,59,0.5)",
          border: value === opt ? "1.5px solid #0ea5e9" : "1.5px solid rgba(148,163,184,0.15)",
          borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
          fontSize: 15, color: value === opt ? "#e2e8f0" : "#94a3b8"
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            border: value === opt ? "2px solid #0ea5e9" : "2px solid #475569",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            {value === opt && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0ea5e9" }} />}
          </div>
          {opt}
        </label>
      ))}
    </div>
  )
}

function CheckboxQuestion({ q, value = [], onChange }: { q: Question; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    const arr = Array.isArray(value) ? value : []
    onChange(arr.includes(opt) ? arr.filter(v => v !== opt) : [...arr, opt])
  }
  const arr = Array.isArray(value) ? value : []
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {q.options?.map((opt, i) => (
        <label key={i} onClick={() => toggle(opt)} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
          background: arr.includes(opt) ? "rgba(14,165,233,0.12)" : "rgba(30,41,59,0.5)",
          border: arr.includes(opt) ? "1.5px solid #0ea5e9" : "1.5px solid rgba(148,163,184,0.15)",
          borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
          fontSize: 15, color: arr.includes(opt) ? "#e2e8f0" : "#94a3b8"
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6,
            border: arr.includes(opt) ? "2px solid #0ea5e9" : "2px solid #475569",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: arr.includes(opt) ? "#0ea5e9" : "transparent", flexShrink: 0
          }}>
            {arr.includes(opt) && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
          </div>
          {opt}
        </label>
      ))}
    </div>
  )
}

function RankingQuestion({ q, value = [], onChange }: { q: Question; value: string[]; onChange: (v: string[]) => void }) {
  const items = value.length === q.options?.length ? value : [...(q.options || [])]
  const move = (from: number, to: number) => {
    const arr = [...items]
    const [el] = arr.splice(from, 1)
    arr.splice(to, 0, el)
    onChange(arr)
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 8px" }}>
        Dùng nút ▲ ▼ để sắp xếp. Vị trí 1 = ảnh hưởng nhiều nhất.
      </p>
      {items.map((opt, i) => (
        <div key={opt} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
          background: i === 0 ? "rgba(14,165,233,0.15)" : "rgba(30,41,59,0.5)",
          border: i === 0 ? "1.5px solid #0ea5e9" : "1.5px solid rgba(148,163,184,0.15)",
          borderRadius: 12, fontSize: 15, color: "#cbd5e1"
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            background: i === 0 ? "#0ea5e9" : "#334155", color: i === 0 ? "#fff" : "#94a3b8",
            fontWeight: 700, fontSize: 13, flexShrink: 0
          }}>{i + 1}</span>
          <span style={{ flex: 1 }}>{opt}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <button disabled={i === 0} onClick={() => move(i, i - 1)} style={{
              background: "none", border: "none", color: i === 0 ? "#334155" : "#94a3b8",
              cursor: i === 0 ? "default" : "pointer", fontSize: 16, padding: 0, lineHeight: 1
            }}>▲</button>
            <button disabled={i === items.length - 1} onClick={() => move(i, i + 1)} style={{
              background: "none", border: "none", color: i === items.length - 1 ? "#334155" : "#94a3b8",
              cursor: i === items.length - 1 ? "default" : "pointer", fontSize: 16, padding: 0, lineHeight: 1
            }}>▼</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function TextQuestion({ q, value = "", onChange }: { q: Question; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={q.placeholder || ""}
      required={q.required}
      style={{
        width: "100%", padding: "14px 16px", background: "rgba(30,41,59,0.5)",
        border: "1.5px solid rgba(148,163,184,0.15)", borderRadius: 12,
        color: "#e2e8f0", fontSize: 15, fontFamily: "inherit",
        outline: "none", boxSizing: "border-box"
      }}
      onFocus={e => e.currentTarget.style.borderColor = "#0ea5e9"}
      onBlur={e => e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)"}
    />
  )
}

function TextareaQuestion({ q, value = "", onChange }: { q: Question; value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Nhập ý kiến của anh/chị..."
      rows={5}
      style={{
        width: "100%", padding: "14px 16px", background: "rgba(30,41,59,0.5)",
        border: "1.5px solid rgba(148,163,184,0.15)", borderRadius: 12,
        color: "#e2e8f0", fontSize: 15, fontFamily: "inherit", resize: "vertical",
        outline: "none", boxSizing: "border-box"
      }}
      onFocus={e => e.currentTarget.style.borderColor = "#0ea5e9"}
      onBlur={e => e.currentTarget.style.borderColor = "rgba(148,163,184,0.15)"}
    />
  )
}

export default function SurveyPage() {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setAnswers(JSON.parse(saved))
    } catch {}
  }, [])

  const saveAnswers = useCallback((a: Record<string, string | string[]>) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(a)) } catch {}
  }, [])

  const setAnswer = (id: string, val: string | string[]) => {
    const next = { ...answers, [id]: val }
    setAnswers(next)
    saveAnswers(next)
  }

  const answeredCount = questions.filter(q => {
    if (!q.required) return false
    const v = answers[q.id]
    if (q.type === "checkbox") return Array.isArray(v) && v.length > 0
    if (q.type === "ranking") return Array.isArray(v) && v.length > 0
    if (q.type === "text" || q.type === "textarea") return !!v && (v as string).trim().length > 0
    return !!v
  }).length

  const requiredCount = questions.filter(q => q.required).length

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const db = getFirestoreDb()
      const surveyRef = collection(db, 'survey_responses')

      await addDoc(surveyRef, {
        answers,
        contact: {
          name: answers.contact_name || "",
          phone: answers.contact_phone || "",
          email: answers.contact_email || "",
          centerName: answers.center_name || ""
        },
        submittedAt: Timestamp.now(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        source: "direct"
      })

      localStorage.removeItem(STORAGE_KEY)
      setSubmitted(true)
    } catch (error) {
      console.error("Submit error:", error)
      alert("Có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại!")
      setIsSubmitting(false)
    }
  }

  const q = questions[currentQ]
  const currentSection = q?.section
  const isLastQ = currentQ === questions.length - 1

  const canNext = () => {
    if (!q) return false
    const v = answers[q.id]
    if (!q.required) return true
    if (q.type === "checkbox") return Array.isArray(v) && v.length > 0
    if (q.type === "ranking") return true
    if (q.type === "text" || q.type === "textarea") return !!v && (v as string).trim().length > 0
    return !!v
  }

  if (showIntro) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0b1120",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
      }}>
        <div style={{
          maxWidth: 520, width: "100%", textAlign: "center",
          animation: "fadeUp 0.6s ease-out"
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: "0 auto 1.5rem",
            background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, boxShadow: "0 8px 32px rgba(14,165,233,0.3)"
          }}>🎓</div>
          <h1 style={{ color: "#f1f5f9", fontSize: 26, fontWeight: 700, margin: "0 0 0.75rem", lineHeight: 1.3 }}>
            Khảo sát Nhu cầu<br />Chuyển đổi số
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, margin: "0 0 0.5rem", lineHeight: 1.6 }}>
            Dành cho Trung tâm GDNN-GDTX
          </p>
          <div style={{
            background: "rgba(30,41,59,0.5)", borderRadius: 16,
            padding: "1.25rem", margin: "1.5rem 0", textAlign: "left",
            border: "1px solid rgba(148,163,184,0.1)"
          }}>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Khảo sát này giúp tìm hiểu thực trạng quản lý và nhu cầu ứng dụng
              công nghệ tại trung tâm. Kết quả sẽ là cơ sở để đề xuất giải pháp
              phần mềm phù hợp nhất.
            </p>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13 }}>
                <span style={{ color: "#0ea5e9" }}>⏱</span> Khoảng 5-7 phút
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13 }}>
                <span style={{ color: "#0ea5e9" }}>📱</span> Tối ưu cho điện thoại
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13 }}>
                <span style={{ color: "#0ea5e9" }}>🔒</span> Thông tin hoàn toàn bảo mật
              </div>
            </div>
          </div>
          <button onClick={() => setShowIntro(false)} style={{
            width: "100%", padding: "16px 24px", fontSize: 16, fontWeight: 600,
            background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
            color: "#fff", border: "none", borderRadius: 14, cursor: "pointer",
            boxShadow: "0 4px 24px rgba(14,165,233,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(14,165,233,0.4)"; }}
          onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(14,165,233,0.3)"; }}
          >
            Bắt đầu khảo sát →
          </button>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 20 }}>
            Thực hiện bởi Giang Hải Sơn — gianghaison.me
          </p>
        </div>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0b1120",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
      }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center", animation: "fadeUp 0.6s ease-out" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 1.5rem",
            background: "linear-gradient(135deg, #10b981, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, boxShadow: "0 8px 32px rgba(16,185,129,0.3)"
          }}>✓</div>
          <h1 style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 700, margin: "0 0 1rem" }}>
            Cảm ơn anh/chị!
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7, margin: "0 0 2rem" }}>
            Kết quả khảo sát đã được ghi nhận. Tôi sẽ phân tích và liên hệ lại
            để trao đổi về giải pháp phù hợp nhất cho trung tâm.
          </p>
          <div style={{
            background: "rgba(30,41,59,0.5)", borderRadius: 16,
            padding: "1.5rem", textAlign: "left",
            border: "1px solid rgba(148,163,184,0.1)"
          }}>
            <h3 style={{ color: "#e2e8f0", fontSize: 15, margin: "0 0 1rem" }}>Tóm tắt câu trả lời:</h3>
            {questions.map(question => {
              const v = answers[question.id]
              if (!v || (Array.isArray(v) && v.length === 0)) return null
              return (
                <div key={question.id} style={{ marginBottom: 16 }}>
                  <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 4px" }}>{question.question}</p>
                  <p style={{ color: "#cbd5e1", fontSize: 14, margin: 0 }}>
                    {Array.isArray(v) ? (question.type === "ranking" ? v.map((item, i) => `${i+1}. ${item}`).join(" → ") : v.join(", ")) : v}
                  </p>
                </div>
              )
            })}
          </div>
          <p style={{ color: "#475569", fontSize: 12, marginTop: 24 }}>
            Giang Hải Sơn — gianghaison.me
          </p>
        </div>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0b1120",
      padding: "1.5rem", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
          }}>🎓</div>
          <span style={{ color: "#64748b", fontSize: 13 }}>Khảo sát GDNN-GDTX</span>
        </div>

        <ProgressBar current={answeredCount} total={requiredCount} />

        <div style={{
          background: "rgba(14,165,233,0.08)", borderRadius: 10, padding: "10px 14px",
          marginBottom: "1.25rem", display: "inline-block",
          border: "1px solid rgba(14,165,233,0.2)"
        }}>
          <span style={{ color: "#0ea5e9", fontSize: 13, fontWeight: 600 }}>{currentSection}</span>
        </div>

        <div key={q.id} style={{ animation: "fadeUp 0.4s ease-out" }}>
          <h2 style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 600, margin: "0 0 1.25rem", lineHeight: 1.5 }}>
            {q.question}
          </h2>

          {q.type === "radio" && <RadioQuestion q={q} value={answers[q.id] as string} onChange={v => setAnswer(q.id, v)} />}
          {q.type === "checkbox" && <CheckboxQuestion q={q} value={answers[q.id] as string[]} onChange={v => setAnswer(q.id, v)} />}
          {q.type === "ranking" && <RankingQuestion q={q} value={answers[q.id] as string[]} onChange={v => setAnswer(q.id, v)} />}
          {q.type === "text" && <TextQuestion q={q} value={answers[q.id] as string} onChange={v => setAnswer(q.id, v)} />}
          {q.type === "textarea" && <TextareaQuestion q={q} value={answers[q.id] as string} onChange={v => setAnswer(q.id, v)} />}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: "2rem" }}>
          <button
            disabled={currentQ === 0}
            onClick={() => setCurrentQ(c => c - 1)}
            style={{
              flex: 1, padding: "14px", fontSize: 15, fontWeight: 500,
              background: currentQ === 0 ? "rgba(30,41,59,0.3)" : "rgba(30,41,59,0.7)",
              color: currentQ === 0 ? "#334155" : "#94a3b8",
              border: "1.5px solid rgba(148,163,184,0.1)", borderRadius: 12,
              cursor: currentQ === 0 ? "default" : "pointer"
            }}
          >← Quay lại</button>

          {isLastQ ? (
            <button
              onClick={handleSubmit}
              disabled={answeredCount < requiredCount || isSubmitting}
              style={{
                flex: 1, padding: "14px", fontSize: 15, fontWeight: 600,
                background: answeredCount >= requiredCount && !isSubmitting
                  ? "linear-gradient(135deg, #10b981, #06b6d4)"
                  : "rgba(30,41,59,0.3)",
                color: answeredCount >= requiredCount && !isSubmitting ? "#fff" : "#334155",
                border: "none", borderRadius: 12,
                cursor: answeredCount >= requiredCount && !isSubmitting ? "pointer" : "default",
                boxShadow: answeredCount >= requiredCount && !isSubmitting ? "0 4px 24px rgba(16,185,129,0.3)" : "none"
              }}
            >{isSubmitting ? "Đang gửi..." : "Gửi khảo sát ✓"}</button>
          ) : (
            <button
              disabled={!canNext()}
              onClick={() => setCurrentQ(c => c + 1)}
              style={{
                flex: 1, padding: "14px", fontSize: 15, fontWeight: 600,
                background: canNext()
                  ? "linear-gradient(135deg, #0ea5e9, #06b6d4)"
                  : "rgba(30,41,59,0.3)",
                color: canNext() ? "#fff" : "#334155",
                border: "none", borderRadius: 12,
                cursor: canNext() ? "pointer" : "default",
                boxShadow: canNext() ? "0 4px 24px rgba(14,165,233,0.3)" : "none"
              }}
            >Tiếp theo →</button>
          )}
        </div>

        <div style={{
          display: "flex", justifyContent: "center", gap: 6, marginTop: "2rem", flexWrap: "wrap"
        }}>
          {questions.map((_, i) => (
            <div key={i} onClick={() => setCurrentQ(i)} style={{
              width: i === currentQ ? 24 : 8, height: 8, borderRadius: 99,
              background: i === currentQ ? "#0ea5e9" : answers[questions[i].id] ? "rgba(14,165,233,0.4)" : "#1e293b",
              cursor: "pointer", transition: "all 0.3s"
            }} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
