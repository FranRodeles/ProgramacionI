function Footer() {
  return (
    <footer className="py-4" style={{ backgroundColor: '#2D3A1C' }}>
      <div className="container">
        <div className="text-center">
          <small style={{ color: '#9CA3AF' }}>
            © {new Date().getFullYear()} QRedirect. Dynamic QR codes & short URLs with analytics.
          </small>
        </div>
      </div>
    </footer>
  )
}

export default Footer
