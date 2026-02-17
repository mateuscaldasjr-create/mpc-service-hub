
export type UserRole = 'admin' | 'tecnico' | 'cliente' | 'fiscal';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  client_id?: string;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  document: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

export interface Contract {
  id: string;
  name: string;
  client_id: string;
  contract_number: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'suspended' | 'expired';
}

export interface Equipment {
  id: string;
  client_id: string;
  contract_id?: string;
  name: string;
  type: string;
  model: string;
  serial_number: string;
  location: string;
}

export type TicketStatus = 'aberto' | 'em_atendimento' | 'aguardando' | 'finalizado' | 'cancelado';
export type TicketPriority = 'baixa' | 'normal' | 'alta' | 'critica';
export type TicketCategory = 'ar_condicionado' | 'gerador' | 'nobreak' | 'informatica' | 'subestacao' | 'rede' | 'transporte' | 'outros';

export interface Ticket {
  id: string;
  number: number;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  client_id: string;
  contract_id?: string;
  equipment_id?: string;
  creator_id: string;
  technician_id?: string;
  location: string;
  opened_at: string;
  closed_at?: string;
  
  // Joins
  client?: Client;
  technician?: Profile;
  equipment?: Equipment;
}

export interface TicketUpdate {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  new_status?: TicketStatus;
  created_at: string;
  user?: Profile;
}
