export default function Footer() {
    return (
        <footer id="contact" className="bg-black border-t border-white/10 text-white py-20 px-6 md:px-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                <div>
                    <h2 className="text-4xl font-bold tracking-tighter mb-4">IS4GI.dev</h2>
                    <p className="text-gray-400 max-w-sm">
                        Crafting digital experiences with precision and passion.
                        Based in the cloud.
                    </p>
                </div>

                <div className="flex gap-8 text-sm font-mono text-gray-400 uppercase tracking-wider">
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-white transition-colors">Email</a>
                </div>
            </div>

            <div className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-xs text-gray-600 font-mono">
                <p>© 2026 IS4GI.dev. All rights reserved.</p>
                <p>Built with Next.js & Motion</p>
            </div>
        </footer>
    );
}
