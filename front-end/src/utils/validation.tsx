
export const validateSignupForm = ({
  password,
  email,
  repeatPassword
}: {
  password: string
  email: string
  repeatPassword: string
}) => {
  const errors = []

  // Email validation (basic regex pattern for email)
  if (!email || email.trim() === '') {
    errors.push('Email is required')
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Please enter a valid email address')
  }

  // Password validation
  if (!password || password.trim() === '') {
    errors.push('Password is required!')
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }

  // Repeat password validation
  if (password !== repeatPassword) {
    errors.push('Passwords do not match')
  }

  return errors
}

export const validateLoginForm = ({ password, email }: { password: string; email: string }) => {
  const errors = []

  // Email validation (basic regex pattern for email)
  if (!email || email.trim() === '') {
    errors.push('Email is required')
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Please enter a valid email address')
  }

  // Password validation
  if (!password || password.trim() === '') {
    errors.push('Password is required!')
  }

  return errors
}

export const validateUpdateForm = ({
  email,
  username
}: {
  username: string | undefined
  email: string | undefined
}) => {
  const errors = []

  if (username && (username.length < 6 || username.length > 20)) {
    errors.push('Username must be at least 6 characters and at most 20 characters')
  } else if (!username || username.trim() === '') {
    errors.push('Please enter a username')
  } else if (username !== username.toLowerCase()) {
    errors.push('Username must be lowercase')
  } else if (!/^[a-zA-Z0-9_]*$/.test(username)) {
    errors.push('Username must contain only letters, numbers, and underscores')
  }

  // Email validation (basic regex pattern for email)
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Please enter a valid email address')
  } else if (!email || email.trim() === '') {
    errors.push('Please enter an email')
  }


  return errors
}
