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
        // Add view types if needed
      };
      Functions: {
        // Add function types if needed
      };
      Enums: {
        // Add enum types if needed
      };
    };
  };
  const TypesDummy = () => null;
  export default TypesDummy;