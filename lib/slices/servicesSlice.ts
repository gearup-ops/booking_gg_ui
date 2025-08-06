import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Service {
  id: string
  name: string
  price: number
  selected: boolean
}

interface ServicesState {
  services: Service[]
  totalPrice: number
}

const initialState: ServicesState = {
  services: [
    { id: '1', name: 'Basic tune-up', price: 299, selected: false },
    { id: '2', name: 'Brake adjustment', price: 199, selected: false },
    { id: '3', name: 'Gear tuning', price: 249, selected: false },
    { id: '4', name: 'Chain cleaning', price: 149, selected: false },
    { id: '5', name: 'Wheel alignment', price: 199, selected: false },
    { id: '6', name: 'Complete service', price: 799, selected: true },
  ],
  totalPrice: 799,
}

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    toggleService: (state, action: PayloadAction<string>) => {
      const service = state.services.find(s => s.id === action.payload)
      if (service) {
        service.selected = !service.selected
        state.totalPrice = state.services
          .filter(s => s.selected)
          .reduce((total, s) => total + s.price, 0)
      }
    },
    selectService: (state, action: PayloadAction<string>) => {
      state.services.forEach(service => {
        service.selected = service.id === action.payload
      })
      const selectedService = state.services.find(s => s.id === action.payload)
      state.totalPrice = selectedService ? selectedService.price : 0
    },
  },
})

export const { toggleService, selectService } = servicesSlice.actions
export default servicesSlice.reducer
