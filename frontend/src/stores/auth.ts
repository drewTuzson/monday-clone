import { create } from 'zustand'
import { apolloClient } from '../lib/apollo'
import { gql } from '@apollo/client'

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        name
        avatarUrl
      }
      accessToken
      refreshToken
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        name
        avatarUrl
      }
      accessToken
      refreshToken
    }
  }
`

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      avatarUrl
      workspaces {
        id
        name
        slug
        logoUrl
      }
    }
  }
`

interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  workspaces?: Array<{
    id: string
    name: string
    slug: string
    logoUrl?: string
  }>
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  initialize: () => Promise<void>
  setTokens: (accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),

  login: async (email: string, password: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password },
      })

      const { user, accessToken, refreshToken } = data.login

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      set({
        user,
        isAuthenticated: true,
        accessToken,
        refreshToken,
      })
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: REGISTER_MUTATION,
        variables: {
          input: { email, password, name },
        },
      })

      const { user, accessToken, refreshToken } = data.register

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      set({
        user,
        isAuthenticated: true,
        accessToken,
        refreshToken,
      })
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    apolloClient.clearStore()
    
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
    })
  },

  initialize: async () => {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      set({ isLoading: false })
      return
    }

    try {
      const { data } = await apolloClient.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only',
      })

      if (data.me) {
        set({
          user: data.me,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        get().logout()
        set({ isLoading: false })
      }
    } catch (error) {
      console.error('Initialize error:', error)
      get().logout()
      set({ isLoading: false })
    }
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    
    set({
      accessToken,
      refreshToken,
    })
  },
}))