from brownie import (
    Lottery,
    LotteyProxyAdmin,
    LotteryProxy,
)
from scripts.useful import get_account, upgrade

ACCOUNT = get_account()


def upgrade_lottery(new_implementation):
    proxy_admin = LotteyProxyAdmin[-1]
    proxy = LotteryProxy[-1]
    upgrade(ACCOUNT, proxy, new_implementation, proxy_admin_contract=proxy_admin)
    print("Proxy has been upgraded!")


def main():
    lottery_new_version = Lottery[-1]
    upgrade_lottery(lottery_new_version)
