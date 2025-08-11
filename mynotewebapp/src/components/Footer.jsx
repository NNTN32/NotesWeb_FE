import { FaGithub, FaTwitter, FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-500 via-pink-500 to-purple-600 text-white py-4 px-6 flex flex-col md:flex-row items-center justify-between animate-in fade-in slide-in-from-bottom-8 shadow-lg">
      <div className="font-semibold tracking-wide">© 2024 MyNoteWeb3. All rights reserved.</div>
      <div className="flex gap-4 mt-2 md:mt-0">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform duration-300 animate-pulse">
          <FaGithub size={24} />
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform duration-300 animate-pulse">
          <FaTwitter size={24} />
        </a>
        <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform duration-300 animate-pulse">
          <FaDiscord size={24} />
        </a>
      </div>
    </footer>
  );
}
