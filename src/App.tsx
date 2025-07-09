import { useState, useMemo } from 'react'
import { useImages } from './hooks/useImages'
import ImageGrid from './components/ImageGrid'
import SearchBar from './components/SearchBar'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState<string[]>([])
  
  // 手動更新のみの画像読み込みフック
  const { images, loading, error, refreshImages } = useImages()

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    images.forEach(image => {
      image.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [images])

  const filteredImages = useMemo(() => {
    return images.filter(image => {
      const matchesSearch = searchQuery === '' || 
        image.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTags = tagFilter.length === 0 || 
        tagFilter.every(tag => image.tags.includes(tag))
      
      return matchesSearch && matchesTags
    })
  }, [images, searchQuery, tagFilter])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">PicViewer</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">画像管理</h2>
            <button
              onClick={refreshImages}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              disabled={loading}
            >
              {loading ? '読み込み中...' : '🔄 更新'}
            </button>
          </div>
          <p className="text-gray-600 text-sm">
            public/picsフォルダ内の画像を管理します
          </p>
        </div>

        <SearchBar
          onSearch={setSearchQuery}
          onTagFilter={setTagFilter}
          availableTags={availableTags}
        />
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredImages.length} / {images.length} 件の画像
          </p>
        </div>
        
        <ImageGrid
          images={filteredImages}
          loading={loading}
          error={error}
          onRefresh={refreshImages}
        />
      </div>
    </div>
  )
}

export default App