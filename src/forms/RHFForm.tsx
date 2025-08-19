import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { formSchema, type FormData } from './schema'
import { getPasswordStrength } from './password'
import { isValidImage, toBase64 } from './image'
import CountryAutocomplete from './CountryAutocomplete'
import { useAppDispatch } from '../store/hooks'
import { upsertEntry } from '../store/formsSlice'

type Props = { onDone: () => void; compact?: boolean }

export default function RHFForm({ onDone, compact = false }: Props) {
  const dispatch = useAppDispatch()
  const [countryUi, setCountryUi] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormData, unknown, FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      country: '',
      gender: 'other',
      strength: { hasLower: false, hasNumber: false, hasSpecial: false, hasUpper: false }
    }
  })

  const password = watch('password') || ''

  const onImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!isValidImage(file)) return
    const b64 = await toBase64(file)
    setValue('imageBase64', b64, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
  }

  const onCountryChange = (v: string) => {
    setCountryUi(v)
    setValue('country', v, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
  }

  const onSubmit: SubmitHandler<FormData> = data => {
    const strength = getPasswordStrength(password)
    dispatch(upsertEntry({ id: nanoid(), ...data, strength, source: 'rhf' }))
    onDone()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`form${compact ? ' compact' : ''}`}>
      <h2>React Hook Form</h2>

      <label htmlFor="name2">Name</label>
      <input id="name2" {...register('name')} />
      {errors.name && <div className="err">{errors.name.message}</div>}

      <label htmlFor="age2">Age</label>
      <input id="age2" type="number" min={0} {...register('age', { valueAsNumber: true })} />
      {errors.age && <div className="err">{errors.age.message}</div>}

      <label htmlFor="email2">Email</label>
      <input id="email2" type="email" {...register('email')} />
      {errors.email && <div className="err">{errors.email.message}</div>}

      <label htmlFor="password2">Password</label>
      <input id="password2" type="password" {...register('password')} />

      <label htmlFor="confirm2">Confirm Password</label>
      <input id="confirm2" type="password" {...register('confirm')} />
      {errors.confirm && <div className="err">{errors.confirm.message}</div>}

      <fieldset>
        <legend>Gender</legend>
        <label><input type="radio" value="male" {...register('gender')} />Male</label>
        <label><input type="radio" value="female" {...register('gender')} />Female</label>
        <label><input type="radio" value="other" defaultChecked {...register('gender')} />Other</label>
      </fieldset>
      {errors.gender && <div className="err">{errors.gender.message}</div>}

      <label><input type="checkbox" {...register('accept')} />Accept T&C</label>
      {errors.accept && <div className="err">{errors.accept.message}</div>}

      <label htmlFor="image2">Picture</label>
      <input id="image2" type="file" accept="image/png,image/jpeg" onChange={onImage} />
      {errors.imageBase64 && <div className="err">{errors.imageBase64.message}</div>}

      <CountryAutocomplete id="country2" value={countryUi} onChange={onCountryChange} />
      {errors.country && <div className="err">{errors.country.message}</div>}

      <div className="strength">
        <span data-ok={/\d/.test(password)}>1 number</span>
        <span data-ok={/[A-Z]/.test(password)}>1 upper</span>
        <span data-ok={/[a-z]/.test(password)}>1 lower</span>
        <span data-ok={/[^A-Za-z0-9]/.test(password)}>1 special</span>
      </div>

      <button type="submit" disabled={!isValid || isSubmitting}>Submit</button>
    </form>
  )
}
