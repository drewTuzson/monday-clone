import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  # Root Query
  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users(workspaceId: ID!): [User!]!
    
    # Workspace queries
    workspace(id: ID!): Workspace
    workspaces: [Workspace!]!
    
    # Board queries
    board(id: ID!): Board
    boards(workspaceId: ID!): [Board!]!
    
    # Item queries
    item(id: ID!): Item
    items(boardId: ID!, groupId: ID, limit: Int, offset: Int): ItemConnection!
    
    # Search
    search(query: String!, workspaceId: ID): SearchResults!
  }

  # Root Mutation
  type Mutation {
    # Auth mutations
    login(email: String!, password: String!): AuthPayload!
    register(input: RegisterInput!): AuthPayload!
    logout: Boolean!
    refreshToken(refreshToken: String!): AuthPayload!
    
    # User mutations
    updateProfile(input: UpdateProfileInput!): User!
    
    # Workspace mutations
    createWorkspace(input: CreateWorkspaceInput!): Workspace!
    updateWorkspace(id: ID!, input: UpdateWorkspaceInput!): Workspace!
    deleteWorkspace(id: ID!): Boolean!
    inviteToWorkspace(workspaceId: ID!, email: String!, role: UserRole!): Boolean!
    
    # Board mutations
    createBoard(input: CreateBoardInput!): Board!
    updateBoard(id: ID!, input: UpdateBoardInput!): Board!
    deleteBoard(id: ID!): Boolean!
    duplicateBoard(id: ID!): Board!
    
    # Column mutations
    createColumn(boardId: ID!, input: CreateColumnInput!): Column!
    updateColumn(id: ID!, input: UpdateColumnInput!): Column!
    deleteColumn(id: ID!): Boolean!
    reorderColumns(boardId: ID!, columnIds: [ID!]!): [Column!]!
    
    # Group mutations
    createGroup(boardId: ID!, input: CreateGroupInput!): Group!
    updateGroup(id: ID!, input: UpdateGroupInput!): Group!
    deleteGroup(id: ID!): Boolean!
    reorderGroups(boardId: ID!, groupIds: [ID!]!): [Group!]!
    
    # Item mutations
    createItem(boardId: ID!, groupId: ID!, input: CreateItemInput!): Item!
    updateItem(id: ID!, input: UpdateItemInput!): Item!
    deleteItem(id: ID!): Boolean!
    moveItem(id: ID!, groupId: ID!, position: Int!): Item!
    duplicateItem(id: ID!): Item!
    
    # Column value mutations
    updateColumnValue(itemId: ID!, columnId: ID!, value: JSON!): ColumnValue!
    
    # Update mutations
    createUpdate(itemId: ID!, input: CreateUpdateInput!): Update!
    deleteUpdate(id: ID!): Boolean!
    
    # Automation mutations
    createAutomation(boardId: ID!, input: CreateAutomationInput!): Automation!
    updateAutomation(id: ID!, input: UpdateAutomationInput!): Automation!
    deleteAutomation(id: ID!): Boolean!
    toggleAutomation(id: ID!): Automation!
  }

  # Root Subscription
  type Subscription {
    # Board subscriptions
    boardUpdated(boardId: ID!): Board!
    
    # Item subscriptions
    itemCreated(boardId: ID!): Item!
    itemUpdated(boardId: ID!): Item!
    itemDeleted(boardId: ID!): ID!
    
    # Column value subscriptions
    columnValueUpdated(boardId: ID!): ColumnValue!
    
    # Update subscriptions
    updateCreated(itemId: ID!): Update!
    
    # Notification subscriptions
    notificationReceived: Notification!
  }

  # Core Types
  type User {
    id: ID!
    email: String!
    name: String!
    avatarUrl: String
    workspaces: [Workspace!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Workspace {
    id: ID!
    name: String!
    slug: String!
    logoUrl: String
    users: [WorkspaceUser!]!
    boards: [Board!]!
    settings: WorkspaceSettings!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type WorkspaceUser {
    user: User!
    role: UserRole!
    joinedAt: DateTime!
  }

  type WorkspaceSettings {
    features: JSON
    branding: JSON
    limits: JSON
  }

  type Board {
    id: ID!
    workspace: Workspace!
    name: String!
    description: String
    type: BoardType!
    columns: [Column!]!
    groups: [Group!]!
    items(groupId: ID, limit: Int, offset: Int): ItemConnection!
    views: [View!]!
    automations: [Automation!]!
    settings: BoardSettings!
    permissions: BoardPermissions!
    createdAt: DateTime!
    updatedAt: DateTime!
    createdBy: User!
  }

  type BoardSettings {
    defaultView: ViewType
    itemDefaults: JSON
    notifications: JSON
  }

  type BoardPermissions {
    canEdit: Boolean!
    canDelete: Boolean!
    canShare: Boolean!
    canManageAutomations: Boolean!
  }

  type Column {
    id: ID!
    board: Board!
    title: String!
    type: ColumnType!
    settings: JSON!
    position: Int!
    width: Int
  }

  type Group {
    id: ID!
    board: Board!
    title: String!
    color: String!
    position: Int!
    isCollapsed: Boolean!
    items(limit: Int, offset: Int): ItemConnection!
  }

  type Item {
    id: ID!
    board: Board!
    group: Group!
    name: String!
    position: Int!
    columnValues: [ColumnValue!]!
    subitems: [Item!]!
    updates: [Update!]!
    activities: [Activity!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    createdBy: User!
  }

  type ItemConnection {
    items: [Item!]!
    totalCount: Int!
    hasMore: Boolean!
  }

  type ColumnValue {
    id: ID!
    item: Item!
    column: Column!
    value: JSON
    displayValue: String!
    lastModifiedBy: User!
    lastModifiedAt: DateTime!
  }

  type Update {
    id: ID!
    item: Item!
    user: User!
    body: String!
    attachments: [Attachment!]!
    mentions: [User!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Attachment {
    id: ID!
    fileName: String!
    fileUrl: String!
    fileSize: Int!
    mimeType: String!
    createdAt: DateTime!
  }

  type View {
    id: ID!
    board: Board!
    name: String!
    type: ViewType!
    settings: JSON!
    isDefault: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Automation {
    id: ID!
    board: Board!
    name: String!
    trigger: JSON!
    conditions: JSON!
    actions: JSON!
    isActive: Boolean!
    executionCount: Int!
    lastExecutedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    createdBy: User!
  }

  type Activity {
    id: ID!
    item: Item!
    type: ActivityType!
    data: JSON!
    createdAt: DateTime!
  }

  type Notification {
    id: ID!
    user: User!
    type: NotificationType!
    title: String!
    body: String!
    data: JSON!
    isRead: Boolean!
    readAt: DateTime
    createdAt: DateTime!
  }

  type SearchResults {
    boards: [Board!]!
    items: [Item!]!
    users: [User!]!
    totalCount: Int!
  }

  type AuthPayload {
    user: User!
    accessToken: String!
    refreshToken: String!
  }

  # Enums
  enum UserRole {
    ADMIN
    MEMBER
    VIEWER
    GUEST
  }

  enum BoardType {
    MAIN
    PRIVATE
    SHAREABLE
  }

  enum ColumnType {
    TEXT
    NUMBERS
    STATUS
    PERSON
    DATE
    TIMELINE
    TAGS
    DROPDOWN
    CHECKBOX
    LINK
    EMAIL
    PHONE
    LOCATION
    FILES
    RATING
    PROGRESS
    FORMULA
    MIRROR
    DEPENDENCY
    CONNECT_BOARDS
  }

  enum ViewType {
    TABLE
    KANBAN
    CALENDAR
    GANTT
    TIMELINE
    CHART
  }

  enum ActivityType {
    ITEM_CREATED
    ITEM_UPDATED
    ITEM_DELETED
    ITEM_MOVED
    COLUMN_VALUE_UPDATED
    UPDATE_POSTED
    FILE_UPLOADED
    USER_MENTIONED
  }

  enum NotificationType {
    MENTION
    ASSIGNMENT
    UPDATE
    DUE_DATE
    AUTOMATION
    SYSTEM
  }

  # Input Types
  input RegisterInput {
    email: String!
    password: String!
    name: String!
  }

  input UpdateProfileInput {
    name: String
    avatarUrl: String
  }

  input CreateWorkspaceInput {
    name: String!
    slug: String!
    logoUrl: String
  }

  input UpdateWorkspaceInput {
    name: String
    logoUrl: String
    settings: JSON
  }

  input CreateBoardInput {
    workspaceId: ID!
    name: String!
    description: String
    type: BoardType!
    templateId: ID
  }

  input UpdateBoardInput {
    name: String
    description: String
    settings: JSON
  }

  input CreateColumnInput {
    title: String!
    type: ColumnType!
    settings: JSON
    position: Int
    width: Int
  }

  input UpdateColumnInput {
    title: String
    settings: JSON
    width: Int
  }

  input CreateGroupInput {
    title: String!
    color: String!
    position: Int
  }

  input UpdateGroupInput {
    title: String
    color: String
    isCollapsed: Boolean
  }

  input CreateItemInput {
    name: String!
    position: Int
    columnValues: [ColumnValueInput!]
  }

  input UpdateItemInput {
    name: String
  }

  input ColumnValueInput {
    columnId: ID!
    value: JSON!
  }

  input CreateUpdateInput {
    body: String!
    attachmentIds: [ID!]
    mentionUserIds: [ID!]
  }

  input CreateAutomationInput {
    name: String!
    trigger: JSON!
    conditions: JSON
    actions: JSON!
  }

  input UpdateAutomationInput {
    name: String
    trigger: JSON
    conditions: JSON
    actions: JSON
    isActive: Boolean
  }
`;