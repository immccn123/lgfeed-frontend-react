import { useEffect } from "react";
import { useNavigate, useParams } from "@remix-run/react";

export default function UserDefaultWrapper() {
  const navigate = useNavigate(),
    { uid } = useParams();
  useEffect(() => navigate(`/user/${uid}/1`), []);
  return null;
}
