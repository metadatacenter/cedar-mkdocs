# iTerm2, oh-my-zsh, powerlevel10k

Although it is not a must, for a smooth development experience we strongly recommend that you install:

* `iTerm2`
* `oh-my-zsh`
* `powerlevel10k`

## Install `iTerm2`

```sh
brew install --cask iterm2
```

## Choose a color preset for `iTerm2`

You can choose a color prest from *Preferences => Profiles => Colors => Color Presets*.

Please be aware that some color presets might flatten some colors that the `cedarcli` utility renders.
This leads to some degree of information loss during the usage of the tool (installed in a later step).

A suitable preset for the full experience would be 'Dark Background' or 'Light Background'.

## Install `oh-my-zsh`

Follow the guide at: [https://ohmyz.sh/#install](https://ohmyz.sh/#install) 

TLDR:
```sh
sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

## Install `Powerlevel10k`

Follow the guide at: [https://github.com/romkatv/powerlevel10k](https://github.com/romkatv/powerlevel10k)

TLDR:
```sh
brew install powerlevel10k
echo "source $(brew --prefix)/share/powerlevel10k/powerlevel10k.zsh-theme" >>~/.zshrc
```

## Configure `p10k` 

```sh
p10k configure
```
