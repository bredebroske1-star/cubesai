// Simple cubesAI response engine ported to JS

function getResponse(text){
  if(!text || !text.trim()) return "Say something about Linux, Arch, AUR, coding, or just chat in English.";
  const t = text.toLowerCase();

  if(/\b(hi|hello|hey|how are you|howdy|good morning|good afternoon|good evening|what's up|sup)\b/.test(t)){
    return "Hello! I'm cubesAI. I speak English and I can help with Linux, AUR, programming, or just normal conversation.";
  }
  if(/\b(thanks|thank you|thx|ty)\b/.test(t)){
    return "You're welcome! Ask me anything else about Linux, coding, or Arch Linux.";
  }
  if(/\b(bye|goodbye|see you|later|peace)\b/.test(t)){
    return "Goodbye! Come back anytime when you need help with Linux or want to chat.";
  }
  if(/\b(can you (help|talk)|speak english|english|i speak english)\b/.test(t)){
    return "Yes, I can chat in English. Ask me anything about Linux, Arch, AUR, terminal commands, or programming.";
  }
  if(/\b(linux|terminal|shell|bash|zsh|kernel|root|sudo|filesystem|permissions|systemctl|journalctl|distro|package manager|pacman|apt|dnf|yum|arch)\b/.test(t)){
    return "I can help with Linux topics: distros, the terminal, shell commands, package managers, system services, permissions, networking, and AUR. Ask a specific question for best help.";
  }
  if(/\b(code|program|javascript|python|java|c\+\+|c#|rust|how do i (write|create)|help me (code|program)|debug|error|stack trace|compile|run|syntax)\b/.test(t)){
    if(/\bpython\b/.test(t)){
      return "Python help — tell me the task. Example: read a JSON file:\n\nimport json\nwith open('file.json') as f:\n    data = json.load(f)\n";
    }
    if(/\bjava\b/.test(t)){
      return "Java help — tell me the goal. Example: a simple Hello World app:\n\npublic class Hello {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, world!\");\n  }\n}\n";
    }
    if(/\b(javascript|js)\b/.test(t)){
      return "JavaScript help — example to reverse a string:\n\nfunction reverse(s) {\n  return s.split('').reverse().join('');\n}\n";
    }
    return "I can help with programming too. Tell me the language and what you want to build or the error you're seeing.";
  }
  if(/\b(pacman|update|upgrade|install|remove|packages?)\b/.test(t)){
    return `Use pacman for official packages. Common commands:\n  sudo pacman -Syu\n  sudo pacman -S <pkg>\n  sudo pacman -R <pkg>\n  sudo pacman -Qs <term>\n  sudo pacman -Ss <term>`;
  }
  if(/\b(aur|yay|pamac|paru|trizen)\b/.test(t)){
    return `AUR packages are built from user repositories. Use an AUR helper like yay or paru:\n  yay -S <aur-package>\n  paru -S <aur-package>\nIf you prefer manual builds, clone the AUR git repo and run:\n  makepkg -si`;
  }
  if(/\b(kernel|boot|grub|systemd|initramfs|bootloader)\b/.test(t)){
    return `For boot issues, check the current kernel and bootloader config. Common steps:\n  sudo journalctl -b --no-pager\n  sudo mkinitcpio -P\n  sudo grub-mkconfig -o /boot/grub/grub.cfg\nUse lsblk and fdisk -l to verify disk layout first.`;
  }
  if(/\b(network|wifi|ethernet|dns|dhcp|connection)\b/.test(t)){
    return `Common network troubleshooting:\n  ip link\n  sudo systemctl status NetworkManager\n  sudo journalctl -u NetworkManager --no-pager\n  ping 8.8.8.8`;
  }
  if(/\b(build|makepkg|pkgbuild|git clone)\b/.test(t)){
    return `Building AUR packages manually:\n  git clone <aur-package-url>\n  cd <repo>\n  makepkg -si\nIf dependencies fail, install them with pacman or another helper first.`;
  }
  if(/\b(help|issue|error|problem|fix)\b/.test(t)){
    return `Give me the exact command and error message for the best help. Use journalctl, dmesg, or sudo pacman -Syu for package issues.`;
  }
  return `I can help with Linux, Arch, AUR, and programming. Ask me about terminal commands, package management, system troubleshooting, or just say hi to chat in English.`;
}

// DOM helpers
const messagesEl = document.getElementById('messages');
const form = document.getElementById('inputForm');
const input = document.getElementById('messageInput');

function addMessage(text, who){
  const div = document.createElement('div');
  div.className = 'message ' + (who === 'user' ? 'user' : 'bot');
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

form.addEventListener('submit', e=>{
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  addMessage(text, 'user');
  input.value = '';
  // Try server-backed API first; fall back to local engine on network errors
  fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({message: text}),
  })
  .then(r => r.json())
  .then(data => {
    if(data && data.reply) addMessage(data.reply, 'bot');
    else addMessage(getResponse(text), 'bot');
  })
  .catch(()=>{
    const resp = getResponse(text);
    addMessage(resp, 'bot');
  });
});

// initial welcome
addMessage('Hello — I am cubesAI. Ask about Linux, AUR, programming, or simply say hi.', 'bot');
