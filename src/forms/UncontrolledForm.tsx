import { useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { formSchema } from './schema'
import { getPasswordStrength } from './password'
import { isValidImage, toBase64 } from './image'
import CountryAutocomplete from './CountryAutocomplete'
import { useAppDispatch } from '../store/hooks'
import { upsertEntry } from '../store/formsSlice'

type Props = { onDone: () => void; compact?: boolean }

export default function UncontrolledForm({ onDone, compact = false }: Props) {
  const f = useRef<HTMLFormElement | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [country, setCountry] = useState('')
  const [pwd, setPwd] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other')
  const [locked, setLocked] = useState(false)
  const dispatch = useAppDispatch()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData(f.current!)
    const image = fd.get('image') as File
    let imageBase64: string | undefined
    if (image && image.size > 0) {
      if (!isValidImage(image)) {
        setErrors({ image: 'Invalid image' })
        setLocked(true)
        return
      }
      imageBase64 = await toBase64(image)
    }
    const data = {
      name: String(fd.get('name') || ''),
      age: Number(fd.get('age') || 0),
      email: String(fd.get('email') || ''),
      password: String(fd.get('password') || ''),
      confirm: String(fd.get('confirm') || ''),
      gender: String(fd.get('gender') || 'other') as 'male' | 'female' | 'other',
      genderOther: String(fd.get('genderOther') || ''),
      accept: Boolean(fd.get('accept')),
      imageBase64,
      country,
      strength: getPasswordStrength(String(fd.get('password') || ''))
    }
    const parsed = formSchema.safeParse(data)
    if (!parsed.success) {
      const es: Record<string, string> = {}
      parsed.error.issues.forEach(i => { es[i.path.join('.')] = i.message })
      setErrors(es)
      setLocked(true)
      return
    }
    dispatch(
      upsertEntry({
        id: nanoid(),
        ...parsed.data,
        accept: true as const,
        source: 'uncontrolled'
      })
    )
    onDone()
  }

  const s = getPasswordStrength(pwd)

  return (
    <form
      ref={f}
      onSubmit={onSubmit}
      onInput={() => setLocked(false)}
      className={`form${compact ? ' compact' : ''}`}
    >
      <h2>Uncontrolled</h2>

      <label htmlFor="name">Name</label>
      <input id="name" name="name" />
      {errors.name && <div className="err">{errors.name}</div>}

      <label htmlFor="age">Age</label>
      <input id="age" name="age" type="number" min={0} />
      {errors.age && <div className="err">{errors.age}</div>}

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" />
      {errors.email && <div className="err">{errors.email}</div>}

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        onChange={e => setPwd(e.target.value)}
      />
      {errors.password && <div className="err">{errors.password}</div>}

      <div className="strength">
        <span data-ok={s.hasNumber}>1 number</span>
        <span data-ok={s.hasUpper}>1 upper</span>
        <span data-ok={s.hasLower}>1 lower</span>
        <span data-ok={s.hasSpecial}>1 special</span>
        <span data-ok={pwd.length >= 8}>min 8 chars</span>
      </div>

      <label htmlFor="confirm">Confirm Password</label>
      <input id="confirm" name="confirm" type="password" />
      {errors.confirm && <div className="err">{errors.confirm}</div>}

      <fieldset>
        <legend>Gender</legend>
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            onChange={() => setGender('male')}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            onChange={() => setGender('female')}
          />
          Female
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="other"
            defaultChecked
            onChange={() => setGender('other')}
          />
          Other
        </label>
      </fieldset>
      {gender === 'other' && (
        <>
          <label htmlFor="genderOther">Please specify</label>
          <input id="genderOther" name="genderOther" />
          {errors.genderOther && <div className="err">{errors.genderOther}</div>}
        </>
      )}
      {errors.gender && <div className="err">{errors.gender}</div>}

      <label>
        <input type="checkbox" name="accept" />
        Accept T&C
      </label>
      {errors.accept && <div className="err">{errors.accept}</div>}

      <label htmlFor="image">Picture</label>
      <input id="image" name="image" type="file" accept="image/png,image/jpeg" />
      {errors.image && <div className="err">{errors.image}</div>}

      <CountryAutocomplete
        id="country"
        value={country}
        onChange={v => {
          setCountry(v)
          setLocked(false)
        }}
      />
      {errors.country && <div className="err">{errors.country}</div>}

      <button type="submit" disabled={locked}>Submit</button>
    </form>
  )
}
