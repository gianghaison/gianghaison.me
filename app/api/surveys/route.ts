import { NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore'

export async function GET() {
  try {
    const db = getFirestoreDb()
    const surveysRef = collection(db, 'survey_responses')
    const q = query(surveysRef, orderBy('submittedAt', 'desc'))
    const snapshot = await getDocs(q)

    const surveys = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate?.()?.toISOString() || null,
      }
    })

    return NextResponse.json({ surveys })
  } catch (error) {
    console.error('Error fetching surveys:', error)
    return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing survey ID' }, { status: 400 })
    }

    const db = getFirestoreDb()
    await deleteDoc(doc(db, 'survey_responses', id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting survey:', error)
    return NextResponse.json({ error: 'Failed to delete survey' }, { status: 500 })
  }
}
