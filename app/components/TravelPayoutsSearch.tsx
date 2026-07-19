export default function TravelPayoutsSearch() {
  return (
    <div className="my-10">
      <iframe
        src="/tpwl-embed.html"
        style={{ width: '100%', minHeight: '600px', border: 'none' }}
        title="Flight search"
      />
    </div>
  )
}