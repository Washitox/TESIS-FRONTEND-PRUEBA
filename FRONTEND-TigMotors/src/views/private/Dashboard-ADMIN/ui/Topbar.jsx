import { FiMenu } from "react-icons/fi";

export default function Topbar({ title = "Dashboard" }) {
  return (
    <header className="bg-gray-800 text-white flex justify-between items-center px-6 h-14">
      <div className="flex items-center space-x-2">
        <FiMenu className="text-xl" />
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
    </header>
  );
}
