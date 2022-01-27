from brownie import accounts, config, network


def get_account(index=0):
    if network.show_active() == "development":
        return accounts[index]
    elif network.show_active() in config["networks"]:
        return accounts.add(config["wallets"]["from_key"])
    return None
