import { useState } from "react";
import { Button } from "keep-react";
// import Logo from "./Logo"; // Assuming Logo is another component
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/TigMotors.png"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder state for login status
  const navigate = useNavigate()

  const navigateLogin = () => {
    navigate("/login")
  }

  const navigateRegister = () =>{
    navigate("/register")
  }



  return (
    <header className="z-30 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-2 rounded-2xl bg-gray-900/90 px-5 before:pointer-events-none before:absolute before:inset-1 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-sm">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            {/* <Logo /> */}
            
            <a href="/" className="flex items-center">
                <img src={logo} className="rounded-full h-10"/>
                <span className="ml-2 font-bold text-white">TigMotors</span>
            </a>
          </div>

          {/* Navigation links or sign-in/signup buttons */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            {!isLoggedIn ? (
              <>
                <li>
                  <Button
                    onClick={navigateLogin}
                    color="secondary"
                    size="sm"
                    className="relative bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] py-[5px] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
                  >
                    Iniciar sesion
                  </Button>
                </li>
                <li>
                  <Button
                    onClick={navigateRegister}
                    color="primary"
                    size="sm"
                    className="bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
                  >
                    Solicitar Registro
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Button
                  onClick={() => setIsLoggedIn(false)}
                  color="danger"
                  size="sm"
                  className="bg-gradient-to-b from-red-600 to-red-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white"
                >
                  Log Out
                </Button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}