import * as yup from 'yup'

const matchesValidationSchema = yup.object().shape({
  lugar: yup
    .string()
    .required('El lugar no puede quedar vacio!!!'),
})

export default matchesValidationSchema;