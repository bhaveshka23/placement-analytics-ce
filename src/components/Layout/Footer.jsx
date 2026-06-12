export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-3">CE Dept – Placement Portal</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Empowering students with data-driven placement insights. Connecting talent with opportunity.
          </p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {['Dashboard', 'Placements', 'Internships', 'Activities','Admin login'].map(l => (
              <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">Contact</h4>
          <p className="text-sm text-gray-400">placement@cedept.edu.in</p>
          <p className="text-sm text-gray-400 mt-1">+91 98765 43210</p>
          <p className="text-sm text-gray-400 mt-1">Computer Engineering Dept, Block A</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        © 2025 Computer Engineering Department. All rights reserved.
      </div>
    </footer>
  );
}