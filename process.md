run on terminal  (from project folder)
code

or run from terminal (from anywhere)
code C:\WorkStation\documate

1019  vsce login inandi
1020  vsce publish
1021  npm install
1022  vsce publish patch
1023  vsce publish patch
1024  vsce publish patch
1025  vsce publish patch
1026  ./release.sh 0.0.6
1027  vsce publish patch
1028  vsce publish patch
1029  vsce publish patch
1030  ./release.sh 0.0.9
1031  vsce publish patch
1032  git tag v0.0.9
1033  git push originv0.0.9
1034  git push origin v0.0.9


vsce publish 1.0.1

finish dev
update readme.md with next version (e.g. `1.0.2`)
update release.md with version and add in git 
run release (`./release.sh 1.0.2`) shell, which will git commit and push
run `vsce publish 1.0.2`
run `git push origin v1.0.2`
