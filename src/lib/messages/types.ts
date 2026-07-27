export type MessageFriendOption = {
  id: string;
  username: string;
  avatarUrl: string;
};

export type ConversationListItem = {
  id: string;
  friend: MessageFriendOption;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unread: boolean;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  mine: boolean;
};

export type ActiveConversation = {
  id: string;
  friend: MessageFriendOption;
  messages: ChatMessage[];
};
