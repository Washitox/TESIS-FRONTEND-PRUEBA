import { useForm } from 'react-hook-form';
import { Input, Label, Button } from 'keep-react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError, // Para establecer errores manualmente
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // Manejar el mensaje de éxito
  const [errorMessage, setErrorMessage] = useState(null); // Para mensajes generales
  const navigate = useNavigate(); // Para redirigir al usuario

  const FormError = ({ message }) => (
    <div className="block font-medium text-red-500 text-sm">{message}</div>
  );

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      phone_number: `+593${data.phone_number}`, // Agrega el prefijo a phone_number
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_API_V1}/register-user`,
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Registro exitoso:', response.data);

      // Verifica si el mensaje de respuesta coincide con el éxito
      if (
        response.data.message ===
        'Registro exitoso, espere a que el administrador apruebe su cuenta para poder iniciar sesión'
      ) {
        setSuccessMessage(response.data.message); // Muestra el mensaje de éxito
        setTimeout(() => {
          navigate('/'); // Redirige al usuario a /landing después de 3 segundos
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error en el registro:', error.response.data);

        // Muestra errores específicos en los campos desde el backend
        if (error.response.data.errors) {
          Object.keys(error.response.data.errors).forEach((key) => {
            setError(key, {
              type: 'server',
              message: error.response.data.errors[key], // Mensaje específico del campo
            });
          });
        } else if (error.response.data.message) {
          setError('general', {
            type: 'server',
            message: error.response.data.message,
          });
        } else if (error.response.data.errors?.business_name) {
          // Manejo específico para el nombre del negocio
          setError('business_name', {
            type: 'server',
            message: 'El nombre del negocio no debe contener números o caracteres especiales.',
          });
        }
        setSuccessMessage(null); // Limpia cualquier mensaje previo
      } else {
        console.error('Error desconocido:', error.message);
        setError('general', {
          type: 'server',
          message: 'Ocurrió un error inesperado. Intente nuevamente.',
        });
      }
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Solicitud de registro
            </h1>
          </div>

          {/* Sign-up form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[400px]">
            <div className="space-y-5">
              {/* Username */}
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

              {/* Business Name */}
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

              {/* Phone Number */}
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

              {/* Password */}
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
                      maxLength: {
                        value: 20,
                        message: 'Debe tener como máximo 20 caracteres',
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$&*]).*$/,
                        message:
                          'Debe contener al menos una letra mayúscula, una minúscula, un dígito y un carácter especial (@, $, !, %, *, ?, &).',
                      },
                    })}
                    className="bg-gray-800 border-slate-900 text-white w-full pr-10"
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

            </div>

            {/* Submit Button */}
            <div className="mt-6 space-y-5">
              <Button type="submit" color="success" className="w-full">
                Solicitar registro
              </Button>
            </div>
          </form>

          {/* General Error Message */}
          {errors.general && (
            <div className="mt-4 text-center text-red-500 font-medium">
              {errors.general.message}
            </div>
          )}

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="mt-6 text-center text-green-500 font-medium">
              {successMessage}
            </div>
          )}

          {/* Bottom link */}
          <div className="mt-6 text-center text-sm text-indigo-200/65">
            ¿Ya tienes una cuenta creada?{' '}
            <Link to="/login" className="font-medium text-indigo-500">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
