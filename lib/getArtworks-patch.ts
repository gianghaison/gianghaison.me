export async function getArtworks(publishedOnly = true): Promise<Art[]> {
  const db = getFirestoreDb()
  const ref = collection(db, 'art')
  const q = query(ref, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  let artworks = snapshot.docs.map(docToArt)
  if (publishedOnly) {
    artworks = artworks.filter(a => (a as any).status === 'published' || !(a as any).status)
  }
  return artworks
}