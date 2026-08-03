public class ResponseEngine {
    public String getResponse(String text) {
        if (text == null || text.trim().isEmpty()) return "Say something about Arch Linux, pacman, AUR, or system troubleshooting.";
        String t = text.toLowerCase();
        if (t.matches(".*\\b(pacman|update|upgrade|install|remove|packages?)\\b.*")) {
            return "Use pacman for official packages. Common commands:\n  sudo pacman -Syu\n  sudo pacman -S <pkg>\n  sudo pacman -R <pkg>\n  sudo pacman -Qs <term>\n  sudo pacman -Ss <term>\n";
        }
        if (t.matches(".*\\b(aur|yay|pamac|paru|trizen)\\b.*")) {
            return "AUR packages are built from user repositories. Use an AUR helper like yay or paru:\n  yay -S <aur-package>\n  paru -S <aur-package>\nIf you prefer manual builds, clone the AUR git repo and run:\n  makepkg -si\n";
        }
        if (t.matches(".*\\b(kernel|boot|grub|systemd|initramfs|bootloader)\\b.*")) {
            return "For boot issues, check the current kernel and bootloader config. Common steps:\n  sudo journalctl -b --no-pager\n  sudo mkinitcpio -P\n  sudo grub-mkconfig -o /boot/grub/grub.cfg\nUse lsblk and fdisk -l to verify disk layout first.\n";
        }
        if (t.matches(".*\\b(network|wifi|ethernet|dns|dhcp|connection)\\b.*")) {
            return "Common network troubleshooting:\n  ip link\n  sudo systemctl status NetworkManager\n  sudo journalctl -u NetworkManager --no-pager\n  ping 8.8.8.8\n";
        }
        if (t.matches(".*\\b(build|makepkg|pkgbuild|git clone)\\b.*")) {
            return "Building AUR packages manually:\n  git clone <aur-package-url>\n  cd <repo>\n  makepkg -si\nIf dependencies fail, install them with pacman or another helper first.\n";
        }
        if (t.matches(".*\\b(help|issue|error|problem|fix)\\b.*")) {
            return "Give me the exact command and error message for the best help. Use journalctl, dmesg, or sudo pacman -Syu for package issues.\n";
        }
        return "I can help with Arch Linux, pacman, and AUR basics. Try asking about pacman -Syu, AUR package builds, or sudo journalctl troubleshooting. For more advanced answers, describe your exact issue.";
    }
}
