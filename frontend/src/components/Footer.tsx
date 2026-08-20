function Footer() {
  return (
    <footer id="contacto" className="qredirect-footer py-4">
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
