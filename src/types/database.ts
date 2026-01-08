export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'customer' | 'provider' | 'admin'
export type PlanType = 'small' | 'medium' | 'large'
export type Frequency = 'biweekly' | 'weekly' | 'twice_weekly'
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'
export type PickupStatus = 'scheduled' | 'skipped' | 'picked_up' | 'washing' | 'ready' | 'out_for_delivery' | 'delivered' | 'no_bags'
export type ProviderStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'deactivated'
export type BackgroundCheckStatus = 'pending' | 'passed' | 'failed'
export type TicketType = 'customer' | 'provider'
export type TicketStatus = 'open' | 'in_progress' | 'resolved'
export type ClaimStatus = 'reported' | 'reviewing' | 'resolved'
export type PayoutStatus = 'pending' | 'processing' | 'sent' | 'failed'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          address_street: string | null
          address_city: string | null
          address_state: string | null
          address_zip: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          phone?: string | null
          address_street?: string | null
          address_city?: string | null
          address_state?: string | null
          address_zip?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          address_street?: string | null
          address_city?: string | null
          address_state?: string | null
          address_zip?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: PlanType
          frequency: Frequency
          pickup_day_1: DayOfWeek
          pickup_day_2: DayOfWeek | null
          pickup_window_start: string
          pickup_window_end: string
          bag_count: number
          status: SubscriptionStatus
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
          paused_at: string | null
          cancelled_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: PlanType
          frequency: Frequency
          pickup_day_1: DayOfWeek
          pickup_day_2?: DayOfWeek | null
          pickup_window_start: string
          pickup_window_end: string
          bag_count: number
          status?: SubscriptionStatus
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
          paused_at?: string | null
          cancelled_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: PlanType
          frequency?: Frequency
          pickup_day_1?: DayOfWeek
          pickup_day_2?: DayOfWeek | null
          pickup_window_start?: string
          pickup_window_end?: string
          bag_count?: number
          status?: SubscriptionStatus
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
          paused_at?: string | null
          cancelled_at?: string | null
        }
      }
      pickups: {
        Row: {
          id: string
          subscription_id: string
          provider_id: string | null
          scheduled_date: string
          scheduled_window_start: string
          scheduled_window_end: string
          status: PickupStatus
          pickup_photo_url: string | null
          delivery_photo_url: string | null
          picked_up_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          provider_id?: string | null
          scheduled_date: string
          scheduled_window_start: string
          scheduled_window_end: string
          status?: PickupStatus
          pickup_photo_url?: string | null
          delivery_photo_url?: string | null
          picked_up_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          provider_id?: string | null
          scheduled_date?: string
          scheduled_window_start?: string
          scheduled_window_end?: string
          status?: PickupStatus
          pickup_photo_url?: string | null
          delivery_photo_url?: string | null
          picked_up_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      providers: {
        Row: {
          id: string
          user_id: string
          status: ProviderStatus
          vehicle_photo_url: string | null
          washer_photo_url: string | null
          dryer_photo_url: string | null
          hours_per_week: number | null
          interest_statement: string | null
          background_check_status: BackgroundCheckStatus | null
          background_check_id: string | null
          stripe_connect_id: string | null
          created_at: string
          updated_at: string
          approved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status?: ProviderStatus
          vehicle_photo_url?: string | null
          washer_photo_url?: string | null
          dryer_photo_url?: string | null
          hours_per_week?: number | null
          interest_statement?: string | null
          background_check_status?: BackgroundCheckStatus | null
          background_check_id?: string | null
          stripe_connect_id?: string | null
          created_at?: string
          updated_at?: string
          approved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: ProviderStatus
          vehicle_photo_url?: string | null
          washer_photo_url?: string | null
          dryer_photo_url?: string | null
          hours_per_week?: number | null
          interest_statement?: string | null
          background_check_status?: BackgroundCheckStatus | null
          background_check_id?: string | null
          stripe_connect_id?: string | null
          created_at?: string
          updated_at?: string
          approved_at?: string | null
        }
      }
      provider_availability: {
        Row: {
          id: string
          provider_id: string
          day_of_week: DayOfWeek
          start_time: string
          end_time: string
        }
        Insert: {
          id?: string
          provider_id: string
          day_of_week: DayOfWeek
          start_time: string
          end_time: string
        }
        Update: {
          id?: string
          provider_id?: string
          day_of_week?: DayOfWeek
          start_time?: string
          end_time?: string
        }
      }
      provider_zones: {
        Row: {
          id: string
          provider_id: string
          zip_code: string
        }
        Insert: {
          id?: string
          provider_id: string
          zip_code: string
        }
        Update: {
          id?: string
          provider_id?: string
          zip_code?: string
        }
      }
      service_zones: {
        Row: {
          id: string
          zip_code: string
          city: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          zip_code: string
          city: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          zip_code?: string
          city?: string
          active?: boolean
          created_at?: string
        }
      }
      waitlist: {
        Row: {
          id: string
          email: string
          zip_code: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          zip_code: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          zip_code?: string
          created_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string
          type: TicketType
          subject: string
          message: string
          status: TicketStatus
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: TicketType
          subject: string
          message: string
          status?: TicketStatus
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: TicketType
          subject?: string
          message?: string
          status?: TicketStatus
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      damage_claims: {
        Row: {
          id: string
          pickup_id: string
          customer_id: string
          provider_id: string
          description: string
          photo_urls: string[] | null
          status: ClaimStatus
          resolution: string | null
          provider_deduction: number | null
          customer_credit: number | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          pickup_id: string
          customer_id: string
          provider_id: string
          description: string
          photo_urls?: string[] | null
          status?: ClaimStatus
          resolution?: string | null
          provider_deduction?: number | null
          customer_credit?: number | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          pickup_id?: string
          customer_id?: string
          provider_id?: string
          description?: string
          photo_urls?: string[] | null
          status?: ClaimStatus
          resolution?: string | null
          provider_deduction?: number | null
          customer_credit?: number | null
          created_at?: string
          resolved_at?: string | null
        }
      }
      payouts: {
        Row: {
          id: string
          provider_id: string
          amount: number
          status: PayoutStatus
          period_start: string
          period_end: string
          stripe_transfer_id: string | null
          created_at: string
          sent_at: string | null
        }
        Insert: {
          id?: string
          provider_id: string
          amount: number
          status?: PayoutStatus
          period_start: string
          period_end: string
          stripe_transfer_id?: string | null
          created_at?: string
          sent_at?: string | null
        }
        Update: {
          id?: string
          provider_id?: string
          amount?: number
          status?: PayoutStatus
          period_start?: string
          period_end?: string
          stripe_transfer_id?: string | null
          created_at?: string
          sent_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      plan_type: PlanType
      frequency: Frequency
      day_of_week: DayOfWeek
      subscription_status: SubscriptionStatus
      pickup_status: PickupStatus
      provider_status: ProviderStatus
      background_check_status: BackgroundCheckStatus
      ticket_type: TicketType
      ticket_status: TicketStatus
      claim_status: ClaimStatus
      payout_status: PayoutStatus
    }
  }
}
