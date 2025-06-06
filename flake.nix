{
  description = "My Awesome Desktop Shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    # Ags widgets type problem with Typescript 5.8
    # https://github.com/Aylur/ags/issues/684
    nixpkgs-typescript.url = "github:nixos/nixpkgs?rev=21808d22b1cda1898b71cf1a1beb524a97add2c4";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, ags, ... }@inputs: let
    system = "x86_64-linux";

    pkgs-typescript = import inputs.nixpkgs-typescript {
      inherit system;
    };

    typescript-overlay = final: prev: {
      typescript = pkgs-typescript.typescript;
    };

    pkgs = import nixpkgs {
      inherit system;
      overlays = [ typescript-overlay ];
    };

    ags-deps = with ags.packages."${system}"; [
      hyprland
    ];
    deps = with pkgs; [];
    dev-deps = with pkgs; [
      nodePackages.typescript-language-server
      vscode-langservers-extracted
    ];
  in {
    packages.${system} = {
      default = ags.lib.bundle {
        inherit pkgs;
        src = ./.;
        name = "bar";
        entry = "src/app.ts";
        gtk4 = true;

        extraPackages = ags-deps ++ deps;
      };
    };

    devShells.${system} = {
      default = pkgs.mkShell {
        buildInputs = [
          (ags.packages.${system}.default.override {
            extraPackages = ags-deps;
          })

          (pkgs.writeShellScriptBin "gen-types" "ags types -d . --package")
          (pkgs.writeShellScriptBin "run-dev" "ags run -d ./src --gtk4")
        ] ++ deps ++ dev-deps ++ ags-deps;
      };
    };
  };
}
