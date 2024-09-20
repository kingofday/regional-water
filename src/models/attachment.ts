export enum DocumentType {
    // mobileNumber = 1,
    // email = 2,
    // info = 3,
    // tel = 4,
    // selfiPicture = 11,
    nationalCard = 12,
    // identityCard = 13,
    // bankCard = 14
}
export type AttachmentItem = {
    type: DocumentType;
    name: string;
    size: string;
    typeDescription: string;
    content: string;
}