// Define the types/interfaces
interface Message {
  id: string;
  time: string;
  to: string[];
  from: string;
  text: string;
  applicationId: string;
  media: string[];
  owner: string;
  direction: string;
  segmentCount: number;
}

export class MessageReceivedDTO {
  type: string;
  time: string;
  description: string;
  to: string;
  message: Message;
}

// Implement the class using the interfaces

interface Message {
  id: string;
  time: string;
  to: string[];
  from: string;
  text: string;
  applicationId: string;
  media: string[];
  owner: string;
  direction: string;
  segmentCount: number;
}

export class MessageStatusDTO {
  type: string;
  time: string;
  description: string;
  to: string;
  errorCode: number;
  message: Message;
}
