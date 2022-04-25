export type TeamMember = {
  id: string
  username: string
  info?: {
    name: string
    lastname: string
  }
  picture?: {
    url: string
  }
}

export type GetTeamMembers = {
  team: TeamMember[]
}
