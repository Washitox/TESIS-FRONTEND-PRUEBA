import { useForm } from 'react-hook-form';
import { Input, Label, Button } from 'keep-react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'keep-react';

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const FormError = ({ message }) => (
    <div className="block font-medium text-red-500 text-sm">{message}</div>
  );

  const onSubmit = async (data) => {
    setLoading(true); // Activa el spinner
    setSuccessMessage(null);
    setErrorMessage(null);

    const formattedData = {
      ...data,
      phone_number: `+593${data.phone_number}`, // Agrega el prefijo
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/register-user`,
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Mensaje de éxito asegurado
      setSuccessMessage('Solicitud registrada, espere la aceptación del administrador');

      // Espera 3 segundos antes de redirigir al usuario
      setTimeout(() => {
        navigate('/'); // Redirige al landing
      }, 3000);
    } catch (error) {
      // Manejo de errores del backend
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          Object.keys(error.response.data.errors).forEach((key) => {
            setError(key, {
              type: 'server',
              message: error.response.data.errors[key],
            });
          });
        } else if (error.response.data.message) {
          setErrorMessage(error.response.data.message); // Muestra el mensaje de error general
        }
      } else {
        setErrorMessage('Ocurrió un error inesperado. Intente nuevamente.');
      }
    } finally {
      setLoading(false); // Desactiva el spinner
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Título */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Solicitud de registro
            </h1>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[400px]">
            {loading && (
              <div className="flex justify-center my-4">
                <Spinner /> {/* Muestra el spinner */}
              </div>
            )}
            <div className="space-y-5">
              {/* Nombre de usuario */}
              <fieldset className="max-w-md space-y-1">
                <Label htmlFor="username">
                  Nombre de usuario <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingrese su nombre de usuario"
                  {...register('username', {
                    required: 'El nombre de usuario es requerido',
                    minLength: { value: 5, message: 'Debe tener al menos 5 caracteres' },
                    maxLength: { value: 50, message: 'Debe tener como máximo 50 caracteres' },
                    pattern: {
                      value: /^[A-Za-z]+$/,
                      message: 'El nombre de usuario no puede contener números ni caracteres especiales',
                    },
                  })}
                  className="bg-gray-800 border-slate-900 text-white"
                />
                {errors.username && <FormError message={errors.username.message} />}
              </fieldset>

              {/* Otros campos */}
              <fieldset className="max-w-md space-y-1">
                <Label htmlFor="business_name">
                  Nombre del negocio <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="business_name"
                  type="text"
                  placeholder="Ingrese el nombre del negocio"
                  {...register('business_name', {
                    required: 'El nombre del negocio es requerido',
                    minLength: { value: 2, message: 'Debe tener al menos dos caracteres' },
                    maxLength: { value: 50, message: 'Debe tener como máximo 50 caracteres' },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'El nombre del negocio no debe contener números o caracteres especiales',
                    },
                  })}
                  className="bg-gray-800 border-slate-900 text-white"
                />
                {errors.business_name && <FormError message={errors.business_name.message} />}
              </fieldset>

              {/* Email */}
              <fieldset className="max-w-md space-y-1">
                <Label htmlFor="email">
                  Correo electrónico <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Correo electrónico"
                  {...register('email', {
                    required: 'El correo electrónico es requerido',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Ingrese un correo electrónico válido',
                    },
                  })}
                  className="bg-gray-800 border-slate-900 text-white"
                />
                {errors.email && <FormError message={errors.email.message} />}
              </fieldset>

              {/* Teléfono */}
              <fieldset className="max-w-md space-y-1">
                <Label htmlFor="phone_number">
                  Número celular <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <span className="bg-gray-700 text-white px-3 py-2 rounded-l-md">+593</span>
                  <Input
                    id="phone_number"
                    type="number"
                    placeholder="Ingrese 9 dígitos"
                    {...register('phone_number', {
                      required: 'El número celular es requerido',
                      pattern: {
                        value: /^\d{9}$/,
                        message: 'Debe contener exactamente 9 dígitos',
                      },
                    })}
                    className="bg-gray-800 border-slate-900 text-white rounded-r-md"
                  />
                </div>
                {errors.phone_number && <FormError message={errors.phone_number.message} />}
              </fieldset>

              {/* Contraseña */}
              <fieldset className="max-w-md space-y-1">
                <Label htmlFor="password">
                  Contraseña <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingrese su contraseña"
                    {...register('password', {
                      required: 'La contraseña es requerida',
                      minLength: {
                        value: 8,
                        message: 'Debe tener al menos 8 caracteres',
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$&*]).*$/,
                        message:
                          'Debe contener al menos una letra mayúscula, una minúscula, un dígito y un carácter especial.',
                      },
                    })}
                    className="bg-gray-800 border-slate-900 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <FormError message={errors.password.message} />}
              </fieldset>
            </div>

            {/* Botón de registro */}
            <div className="mt-6">
              <Button type="submit" color="success" className="w-full">
                Solicitar registro
              </Button>
            </div>
          </form>

          {/* Mensajes de éxito o error */}
          {errorMessage && (
            <div className="mt-4 text-center text-red-500 font-medium">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mt-4 text-center text-green-500 font-medium">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
