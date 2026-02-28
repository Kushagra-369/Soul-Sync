import { createContext, useContext, useEffect, useState } from "react";
import { APIURL } from "../../GlobalAPIURL";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {
      setLoading(false);
      return;
    }

    fetch(`${APIURL}/me/${deviceId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));

  }, []);

  const login = (data: any) => {
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("deviceId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};