from brownie import Lottery, config, network
from scripts.useful import get_account

OWNER = get_account()

LINK_TOKEN = config["networks"][network.show_active()]["link_token"]
VRF_COORDINATOR = config["networks"][network.show_active()]["vrf_coordinator"]
KEYHASH = config["networks"][network.show_active()]["keyhash"]
FEE = config["networks"][network.show_active()]["keyhash"]
WINNER_PERCENTAGE = 90


def deploy_lottery():
    print(network.show_active())
    dappz_lottery = Lottery.deploy(
        # LINK_TOKEN,
        # VRF_COORDINATOR,
        # KEYHASH,
        # FEE,
        # WINNER_PERCENTAGE,
        {"from": OWNER},
        publish_source=True,
    )
    return dappz_lottery


def main():
    deploy_lottery()


# def publish_source(con):
#     contract = con.at(con[-1])
#     con.publish_source(contract)
