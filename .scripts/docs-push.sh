set -e

version=$(node -p "require('./package.json').version")

cd docs
git add .
git commit -m "Release version $version"
git push
cd ..
