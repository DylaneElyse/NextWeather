export type Database = {
    public: {
      Tables: {
        profiles: {
          Row: {
            id: string;
            username: string;
            full_name: string | null;
            avatar_url: string | null;
            updated_at: string | null;
          };
          Insert: {
            id: string;
            username: string;
            full_name?: string | null;
            avatar_url?: string | null;
            updated_at?: string | null;
          };
          Update: {
            id?: string;
            username?: string;
            full_name?: string | null;
            avatar_url?: string | null;
            updated_at?: string | null;
          };
        };
      };
      Views: {
      };
      Functions: {
      };
      Enums: {
      };
    };
  };
  const TypesDummy = () => null;
  export default TypesDummy;