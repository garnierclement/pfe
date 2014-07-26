#!/bin/sh

# Automatize the generation of PDF and HTML documentation compiling the READMEs

# Create temp files to remove ToC from DocToc for PDF output
sed '/<!-- START/,/<!-- END/d' ../sensors/README.md > tmp_sensor.md
sed '/<!-- START/,/<!-- END/d' ../projects/manticore/README.md > tmp_manticore.md

# Use Pandoc to generate the PDF documentation
pandoc tmp_sensor.md tmp_manticore.md \
	-o doc.pdf \
	--tab-stop=2 --toc --toc-depth=4 -N --chapters \
	-V title="\textbf{Manticore} \\\ Documentation \\\ and \\\ Development Guide" \
	-V author="Homère \textsc{Faivre}" \
	-V author="Clément \textsc{Garnier}" \
	-V geometry="margin=1.2in" \
	-V date="\today" \
	-V papersize="a4paper"

# Remove temp files
rm tmp_sensor.md
rm tmp_manticore.md

# Use Pandoc to generate the HTML documentation
pandoc ../sensors/README.md ../projects/manticore/README.md \
	-o doc.html \
	--tab-stop=2 -N -s \
	-V title="Manticore <br> Documentation and Development Guide" \
	-V lang="en"