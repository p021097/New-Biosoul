import React, { useContext } from "react";
import "./Authorize.css";
import { StoreContext } from "../../Context/StoreContext";

const Authorize = () => {
  const {
    adminRequests,
    admins,
    approveRequest,
    rejectRequest,
    revokeAdmin,
    adminProfile,
    restoreAdminAccess
  } = useContext(StoreContext);
  return (
    <div className="authorize-page">
      <h3>Admin Requests</h3>
      <div className="authorize-table">
        {adminRequests.map((req) => (
          <div className="authorize-row" key={req._id}>
            <p>{req.name}</p>
            <p>{req.email}</p>
            <p>{req.status}</p>
            {req.status === "pending" ? (
              <div>
                <button onClick={() => approveRequest(req._id)}>Approve</button>
                <button onClick={() => rejectRequest(req._id)}>Reject</button>
              </div>
            ) : (
              <p>-</p>
            )}
          </div>
        ))}
      </div>
      <h3>Admins</h3>
      <div className="authorize-table">
        {admins.map((a) => (
          <div key={a._id} className="authorize-row">
            <p>{a.name}</p>
            <p>{a.email}</p>
            <p>{a.isActive ? "approved" : "restricted"}</p>
            {adminProfile?.isSuperAdmin && !a.isSuperAdmin ? (
              a.isActive ? (
                <button onClick={() => revokeAdmin(a._id)}>
                  Revoke Access
                </button>
              ) : (
                <button onClick={() => restoreAdminAccess(a._id)}>
                  Restore Access
                </button>
              )
            ) : (
              <p>-</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Authorize;
