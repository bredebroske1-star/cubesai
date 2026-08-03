#!/usr/bin/env python3
import re
import sys
import os
import shutil

INTRO = """
ArchAI — your Arch Linux terminal assistant.
Type a question about pacman, AUR, system troubleshooting, or Arch concepts.
Type 'exit' or 'quit' to leave.
"""

RESPONSES = [
    {
        "patterns": [r"\b(pacman|update|upgrade|install|remove|packages?)\b"],
        "response": (
            "Use pacman for official packages. Common commands:\n"
            "  sudo pacman -Syu         # update system\n"
            "  sudo pacman -S <pkg>     # install package\n"
            "  sudo pacman -R <pkg>     # remove package\n"
            "  sudo pacman -Qs <term>   # search installed packages\n"
            "  sudo pacman -Ss <term>   # search repos\n"
        ),
    },
    {
        "patterns": [r"\b(aur|yay|pamac|trizen|paru|aur helpers?)\b"],
        "response": (
            "AUR packages are built from user repositories. Use an AUR helper like yay or paru:\n"
            "  yay -S <aur-package>\n"
            "  paru -S <aur-package>\n"
            "If you prefer manual builds, clone the AUR git repo and run:\n"
            "  makepkg -si\n"
        ),
    },
    {
        "patterns": [r"\b(kernel|boot|grub|systemd|initramfs|bootloader)\b"],
        "response": (
            "For boot issues, check the current kernel and bootloader config. Common steps:\n"
            "  sudo journalctl -b --no-pager\n"
            "  sudo mkinitcpio -P\n"
            "  sudo grub-mkconfig -o /boot/grub/grub.cfg\n"
            "Use `lsblk` and `fdisk -l` to verify disk layout first.\n"
        ),
    },
    {
        "patterns": [r"\b(network|wifi|ethernet|dns|dhcp|connection)\b"],
        "response": (
            "Common network troubleshooting:\n"
            "  ip link\n"
            "  sudo systemctl status NetworkManager\n"
            "  sudo journalctl -u NetworkManager --no-pager\n"
            "  ping 8.8.8.8 and `dig @1.1.1.1 archlinux.org`\n"
        ),
    },
    {
        "patterns": [r"\b(aur|build|makepkg|PKGBUILD|git clone)\b"],
        "response": (
            "Building AUR packages manually:\n"
            "  git clone <aur-package-url>\n"
            "  cd <repo>\n"
            "  makepkg -si\n"
            "If dependencies fail, install them with pacman or another helper first.\n"
        ),
    },
    {
        "patterns": [r"\b(help|issue|error|problem|fix)\b"],
        "response": (
            "Give me the exact command and error message for the best help.\n"
            "Use `journalctl`, `dmesg`, or `sudo pacman -Syu` for package issues.\n"
        ),
    },
]

COMMON_ANSWERS = {
    "arch": "Arch Linux is a lightweight, rolling-release distro focused on simplicity and user control.",
    "kernel": "The Linux kernel is the core of Arch. Use `uname -r` to show your current kernel version.",
    "mirror": "Use `reflector --country <country> --latest 20 --sort rate --save /etc/pacman.d/mirrorlist` to refresh mirrors.",
    "sudo": "Use sudo to run administrative commands. Configure /etc/sudoers or add yourself to wheel for setup.",
    "live usb": "Boot from an Arch ISO and use the live environment for installation or recovery.",
}

EXTRA_COMMANDS = {
    "help": "Type a question about Arch Linux, pacman, AUR, or system troubleshooting. Type 'exit' or 'quit' to leave.",
    "commands": "Available commands: help, commands, version, about, exit",
    "version": "ArchAI version 0.1 - terminal helper for Arch Linux.",
    "about": "ArchAI is a simple Arch Linux terminal chatbot for catchyOS inspired workflows.",
}


def match_patterns(text, patterns):
    for pattern in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


def get_response(text):
    text = text.strip()
    if not text:
        return "Say something about Arch Linux, pacman, AUR, or system troubleshooting."

    if text.lower() in ("exit", "quit"):
        return None
    if text.lower() in EXTRA_COMMANDS:
        return EXTRA_COMMANDS[text.lower()]

    for answer in RESPONSES:
        if match_patterns(text, answer["patterns"]):
            return answer["response"]

    for keyword, answer in COMMON_ANSWERS.items():
        if keyword in text.lower():
            return answer

    return (
        "I can help with Arch Linux, pacman, and AUR basics.\n"
        "Try asking about `pacman -Syu`, AUR package builds, or `sudo journalctl` troubleshooting.\n"
        "For more advanced answers, describe your exact issue.\n"
    )


def main():
    print(INTRO)
    try:
        while True:
            prompt = input("ArchAI> ")
            response = get_response(prompt)
            if response is None:
                print("Goodbye. Stay stable.")
                break
            print(response)
    except (KeyboardInterrupt, EOFError):
        print("\nGoodbye. Stay stable.")


if __name__ == "__main__":
    main()
