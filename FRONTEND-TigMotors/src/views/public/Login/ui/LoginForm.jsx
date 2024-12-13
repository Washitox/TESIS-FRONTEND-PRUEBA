import { Input, Label, Button } from "keep-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const FormError = ({ message }) => (
    <div className="block font-medium text-red-500 text-sm">{message}</div>
  );

  const onSubmit = async (data) => {
    setErrorMessage(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_API_V1}/login-global`,
        data
      );

      if (response.data.status !== "success") {
        setErrorMessage("Error de autenticación. Intente nuevamente.");
        return;
      }

      const token = response.data.token;
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.roles[0]?.authority;

      // Guardar token y rol en localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", userRole);

      switch (userRole) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "PERSONAL_CENTRO_DE_SERVICIOS":
          navigate("/personal");
          break;
        case "USER":
          navigate("/user");
          break;
        default:
          setErrorMessage("Rol desconocido. Contacte al administrador.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message || "Error al iniciar sesión. Verifique sus credenciales."
      );
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="pb-12 text-center">
          <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">Inicio de sesión</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[400px]">
            <div className="space-y-5">
              <fieldset className="space-y-1">
                <Label htmlFor="username">Usuario<span className="text-red-500">*</span></Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Usuario"
                  {...register("username", { required: "Tu usuario es requerido" })}
                className="bg-gray-800 border-slate-900 text-white"
                />
                {errors.username && <FormError message={errors.username.message} />}
              </fieldset> 
              <fieldset className="space-y-1">
                <Label htmlFor="password">Contraseña<span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    {...register("password", {
                      required: "Tu contraseña es requerida",
                      minLength: { value: 8, message: "Mínimo 8 caracteres." },
                    })}
                  className="bg-gray-800 border-slate-900 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <FormError message={errors.password.message} />}
              </fieldset>
              <Button  type="submit" color="success" className="w-full">
                Iniciar Sesión
              </Button>
              {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </div>
            {/* Opción de "Olvidaste tu contraseña" */}
            <div className="text-center mt-4">
              <a
                href="/reset-password"
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
