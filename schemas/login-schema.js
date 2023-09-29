import * as yup from 'yup'

const loginValidationSchema = yup.object().shape({
  apodo: yup
    .string()
    .required('El nombre no puede quedar vacio!!!'),
})

export default loginValidationSchema;