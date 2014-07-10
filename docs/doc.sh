#!/bin/sh

# Use Pandoc to generate the PDF documentation
pandoc ../sensors/README.md ../projects/manticore/README.md \
	-o doc.pdf \
	--tab-stop=2 --toc --toc-depth=4 -N --chapters \
	-V title="\textbf{Manticore}" \
	-V author="Homère \textsc{Faivre}" \
	-V author="Clément \textsc{Garnier}" \
	-V geometry="margin=1.2in" \
	-V date="\today" \
	-V papersize="a4paper"