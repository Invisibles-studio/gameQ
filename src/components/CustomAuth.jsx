/* eslint-disable */

import { useMoralis } from "react-moralis";
import { useState } from "react";
import Chains from "./Chains";
import NativeBalance from "./NativeBalance";
import { Modal } from "antd";
import { connectors } from "./Account/config";
import Text from "antd/lib/typography/Text";

const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
  },
  text: {
    color: "#21BF96",
  },
  connector: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "auto",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "20px 5px",
    cursor: "pointer",
  },
  icon: {
    alignSelf: "center",
    fill: "rgb(40, 13, 95)",
    flexShrink: "0",
    marginBottom: "8px",
    height: "30px",
  },
};

export default function CustomAuth() {
  const { isAuthenticated, authenticate, account } = useMoralis();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

    if (!isAuthenticated || account == null){
      return (
        <div>
          <input type="button" className="AuthButton" value="Auth" onClick={() => setIsAuthModalVisible(true)}/>
          <Modal
            visible={isAuthModalVisible}
            footer={null}
            onCancel={() => setIsAuthModalVisible(false)}
            bodyStyle={{
              padding: "15px",
              fontSize: "17px",
              fontWeight: "500",
            }}
            style={{ fontSize: "16px", fontWeight: "500" }}
            width="340px"
          >
            <div
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "20px",
              }}
            >
              Connect Wallet
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {connectors.map(({ title, icon, connectorId }, key) => (
                <div
                  style={styles.connector}
                  key={key}
                  onClick={async () => {
                    try {
                      await authenticate({ provider: connectorId });
                      window.localStorage.setItem("connectorId", connectorId);
                      setIsAuthModalVisible(false);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <img src={icon} alt={title} style={styles.icon} />
                  <Text style={{ fontSize: "14px" }}>{title}</Text>
                </div>
              ))}
            </div>
          </Modal>
        </div>
      )
    }
    else{
      return (
        <div className="UserBlock">
          <div className="ChainsChoose">
            <Chains/>
          </div>
          <div className="NativeBalance" >
            <NativeBalance />
          </div>
          <div className="accountAddress">
            <p>{account.slice(0, 2) + "..." + account.slice(-6)}</p>
          </div>
        </div>
      )
    }
}