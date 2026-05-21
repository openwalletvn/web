export type PageContext =
    | {
          type: 'card';
          cardId: string;
          cardName: string;
          bankId: string;
          cardNetwork: string;
          cardType: string[];
          description?: string;
      }
    | {
          type: 'bank';
          bankId: string;
          bankName: string;
      }
    | null;
