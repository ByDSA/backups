set -e

name=$(node -p "require('./package.json').name")
echo "Package: $name"

echo "Creating folder 'docs' if not existing...'"
mkdir -p docs
if [ ! -d 'docs/.git' ]; then
    url=https://github.com/ByDSA/${name}.wiki.git
    echo "Cloning $url ..."
    git clone $url docs
fi
echo "Cleaning existing *.md..."
rm -rf docs/*.md
