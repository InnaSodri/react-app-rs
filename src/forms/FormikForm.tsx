import { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import type { FormikHelpers } from 'formik'
import { nanoid } from 'nanoid'
import { formSchema, type FormData } from './schema'
import { getPasswordStrength } from './password'
import { isValidImage, toBase64 } from './image'
import CountryAutocomplete from './CountryAutocomplete'
import { useAppDispatch } from '../store/hooks'
import { upsertEntry } from '../store/formsSlice'

type Props = { onDone: () => void; compact?: boolean }
type FormikValues = Omit<FormData, 'accept'> & { accept: boolean }

export default function FormikForm({ onDone, compact = false }: Props) {
  const dispatch = useAppDispatch()
  const [countryUi, setCountryUi] = useState('')

  const initialValues: FormikValues = {
    name: '',
    age: 0,
    email: '',
    password: '',
    confirm: '',
    gender: 'other',
    genderOther: '',
    accept: false,
    country: '',
    imageBase64: undefined,
    strength: { hasLower: false, hasNumber: false, hasSpecial: false, hasUpper: false }
  }

  return (
    <Formik<FormikValues>
      initialValues={initialValues}
      validateOnBlur
      validateOnChange
      validateOnMount
      validate={(values: FormikValues): Record<string, string> => {
        const toValidate: FormData = {
          ...values,
          accept: (values.accept ? true : false) as true,
          strength: getPasswordStrength(values.password || '')
        }
        const parsed = formSchema.safeParse(toValidate)
        if (parsed.success) return {}
        const errs: Record<string, string> = {}
        for (const i of parsed.error.issues) errs[i.path.join('.')] = i.message
        return errs
      }}
      onSubmit={(values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
        const out: FormData = {
          ...values,
          accept: true,
          strength: getPasswordStrength(values.password || '')
        }
        dispatch(upsertEntry({ id: nanoid(), ...out, source: 'formik' }))
        helpers.setSubmitting(false)
        onDone()
      }}
    >
      {({ values, errors, touched, submitCount, isValid, isSubmitting, setFieldValue }) => {
        const s = getPasswordStrength(values.password || '')
        const getErr = <K extends keyof FormikValues>(k: K): string | undefined => {
          const v = errors[k]
          return typeof v === 'string' ? v : undefined
        }
        const wasTouched = <K extends keyof FormikValues>(k: K): boolean => {
          const t = touched[k]
          return typeof t === 'boolean' ? t : false
        }
        const showErr = <K extends keyof FormikValues>(k: K): boolean =>
          (wasTouched(k) || submitCount > 0) && !!getErr(k)

        return (
          <Form className={`form${compact ? ' compact' : ''}`}>
            <h2>Formik</h2>

            <label htmlFor="name3">Name</label>
            <Field id="name3" name="name" />
            {showErr('name') && <div className="err">{getErr('name')}</div>}

            <label htmlFor="age3">Age</label>
            <Field id="age3" name="age" type="number" min={0} />
            {showErr('age') && <div className="err">{getErr('age')}</div>}

            <label htmlFor="email3">Email</label>
            <Field id="email3" name="email" type="email" />
            {showErr('email') && <div className="err">{getErr('email')}</div>}

            <label htmlFor="password3">Password</label>
            <Field id="password3" name="password" type="password" />
            {showErr('password') && <div className="err">{getErr('password')}</div>}

            <div className="strength">
              <span data-ok={s.hasNumber}>1 number</span>
              <span data-ok={s.hasUpper}>1 upper</span>
              <span data-ok={s.hasLower}>1 lower</span>
              <span data-ok={s.hasSpecial}>1 special</span>
              <span data-ok={(values.password ?? '').length >= 8}>min 8 chars</span>
            </div>

            <label htmlFor="confirm3">Confirm Password</label>
            <Field id="confirm3" name="confirm" type="password" />
            {showErr('confirm') && <div className="err">{getErr('confirm')}</div>}

            <fieldset>
              <legend>Gender</legend>
              <label><Field type="radio" name="gender" value="male" />Male</label>
              <label><Field type="radio" name="gender" value="female" />Female</label>
              <label><Field type="radio" name="gender" value="other" />Other</label>
            </fieldset>
            {values.gender === 'other' && (
              <>
                <label htmlFor="genderOther3">Please specify</label>
                <Field id="genderOther3" name="genderOther" />
                {showErr('genderOther') && <div className="err">{getErr('genderOther')}</div>}
              </>
            )}
            {showErr('gender') && <div className="err">{getErr('gender')}</div>}

            <label><Field type="checkbox" name="accept" />Accept T&C</label>
            {showErr('accept') && <div className="err">{getErr('accept')}</div>}

            <label htmlFor="image3">Picture</label>
            <input
              id="image3"
              type="file"
              accept="image/png,image/jpeg"
              onChange={async (e) => {
                const file = e.currentTarget.files?.[0]
                if (!file) return
                if (!isValidImage(file)) {
                  e.currentTarget.value = ''
                  setFieldValue('imageBase64', undefined, false)
                  return
                }
                const b64 = await toBase64(file)
                setFieldValue('imageBase64', b64, true)
              }}
            />
            {showErr('imageBase64') && <div className="err">{getErr('imageBase64')}</div>}

            <CountryAutocomplete
              id="country3"
              value={countryUi}
              onChange={(v) => {
                setCountryUi(v)
                setFieldValue('country', v, true)
              }}
            />
            {showErr('country') && <div className="err">{getErr('country')}</div>}

            <button type="submit" disabled={!isValid || isSubmitting}>Submit</button>
          </Form>
        )
      }}
    </Formik>
  )
}
