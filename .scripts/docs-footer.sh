authorName=$(node -p "require('./package.json').author?.name")
authorGithubUsername=$(node -p "require('./package.json').author?.github")
authorEmail=$(node -p "require('./package.json').author?.email")
currentYear=$(date +'%Y')

footer="Copyright © $currentYear [$authorName](https://github.com/$authorGithubUsername)"
if [ ! -z $authorEmail ]; then
    footer="$footer \<${authorEmail}\>"
fi
footer="$footer."
echo $footer > docs/_Footer.md
