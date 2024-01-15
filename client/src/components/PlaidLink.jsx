import React, { useEffect, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import "./PlaidLink.css";

export default function PlaidLink({
  token,
  updateToken,
  updateData,
  updateLoading,
}) {
  const onSuccess = useCallback(
    async (publicToken) => {
      // setLoading(true);
      updateLoading(true);
      await fetch("/api/exchange_public_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_token: publicToken }),
      });
      await getBalance();
    },
    [updateLoading]
  );

  // Creates a Link token
  const createLinkToken = React.useCallback(async () => {
    // For OAuth, use previously generated Link token
    if (window.location.href.includes("?oauth_state_id=")) {
      const linkToken = localStorage.getItem("link_token");
      updateToken(linkToken);
    } else {
      const response = await fetch("/api/create_link_token", {});
      const data = await response.json();
      updateToken(data.link_token);
      localStorage.setItem("link_token", data.link_token);
    }
  }, [updateToken]);

  // Fetch balance data
  const getBalance = React.useCallback(async () => {
    updateLoading(true);
    const response = await fetch("/api/balance", {});
    const data = await response.json();
    updateData(data);
    updateLoading(false);
  }, [updateData, updateLoading]);

  let isOauth = false;

  const config = {
    token,
    onSuccess,
  };

  // For OAuth, configure the received redirect URI
  if (window.location.href.includes("?oauth_state_id=")) {
    config.receivedRedirectUri = window.location.href;
    isOauth = true;
  }
  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (token == null) {
      createLinkToken();
    }
    if (isOauth && ready) {
      open();
    }
  }, [token, isOauth, ready, open]);

  return (
    <div>
      <button className="plaid-button" onClick={() => open()} disabled={!ready}>
        <strong>Link account</strong>
      </button>
    </div>
  );
}
