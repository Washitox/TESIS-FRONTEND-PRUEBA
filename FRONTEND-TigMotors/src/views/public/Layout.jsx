import Header from "./Header";
import { Outlet } from "react-router-dom";


export default function Layout() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Header/>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}
