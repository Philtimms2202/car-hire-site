{/* Category Pills */}
<div className="mt-6 px-4 max-w-4xl mx-auto">
  <div
    className="
      flex gap-2 overflow-x-auto pb-3 scrollbar-hide 
      whitespace-nowrap 
      -mx-4 px-4
    "
  >
    {categories.map((cat) => {
      const isActive = activeCategory === cat.query && !search
      return (
        <button
          key={cat.label}
          onClick={() => handleCategory(cat.query)}
          className="
            px-4 py-2 rounded-full text-sm font-semibold border transition 
            flex-shrink-0
          "
          style={
            isActive
              ? {
                  backgroundColor: '#2f797c',
                  color: 'white',
                  borderColor: '#2f797c',
                }
              : {
                  backgroundColor: 'white',
                  color: '#232e4e',
                  borderColor: '#e5e7eb',
                }
          }
        >
          {cat.label}
        </button>
      )
    })}
  </div>
</div>